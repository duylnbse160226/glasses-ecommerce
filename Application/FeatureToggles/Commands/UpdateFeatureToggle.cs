using Application.Core;
using Application.FeatureToggles.DTOs;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.FeatureToggles.Commands;

public sealed class UpdateFeatureToggle
{
    public sealed class Command : IRequest<Result<FeatureToggleDto>>
    {
        public required Guid Id { get; set; }
        public required UpdateFeatureToggleDto Dto { get; set; }
    }

    internal sealed class Handler(
        AppDbContext context,
        IMapper mapper,
        IUserAccessor userAccessor) : IRequestHandler<Command, Result<FeatureToggleDto>>
    {
        public async Task<Result<FeatureToggleDto>> Handle(Command request, CancellationToken ct)
        {
            UpdateFeatureToggleDto dto = request.Dto;

            if (dto.EffectiveTo.HasValue && dto.EffectiveFrom.HasValue
                && dto.EffectiveTo <= dto.EffectiveFrom)
                return Result<FeatureToggleDto>.Failure("EffectiveTo must be after EffectiveFrom.", 400);

            FeatureToggle? toggle = await context.FeatureToggles
                .FirstOrDefaultAsync(ft => ft.Id == request.Id, ct);

            if (toggle == null)
                return Result<FeatureToggleDto>.Failure("Feature toggle not found.", 404);

            bool nameExists = await context.FeatureToggles
                .AnyAsync(ft => ft.FeatureName == dto.FeatureName && ft.Id != request.Id, ct);

            if (nameExists)
                return Result<FeatureToggleDto>.Failure($"A feature toggle with name '{dto.FeatureName}' already exists.", 409);

            Guid userId = userAccessor.GetUserId();

            toggle.FeatureName = dto.FeatureName;
            toggle.IsEnabled = dto.IsEnabled;
            toggle.Description = string.IsNullOrWhiteSpace(dto.Description) ? null : dto.Description;
            toggle.EffectiveFrom = dto.EffectiveFrom;
            toggle.EffectiveTo = dto.EffectiveTo;
            toggle.Scope = string.IsNullOrWhiteSpace(dto.Scope) ? null : dto.Scope;
            toggle.ScopeValue = string.IsNullOrWhiteSpace(dto.ScopeValue) ? null : dto.ScopeValue;
            toggle.UpdatedAt = DateTime.UtcNow;
            toggle.UpdatedBy = userId;

            bool success = await context.SaveChangesAsync(ct) > 0;

            if (!success)
                return Result<FeatureToggleDto>.Failure("Failed to update feature toggle.", 500);

            FeatureToggleDto result = await context.FeatureToggles
                .AsNoTracking()
                .Where(ft => ft.Id == toggle.Id)
                .ProjectTo<FeatureToggleDto>(mapper.ConfigurationProvider)
                .FirstAsync(ct);

            return Result<FeatureToggleDto>.Success(result);
        }
    }
}
