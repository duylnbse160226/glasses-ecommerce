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

public sealed class CreateFeatureToggle
{
    public sealed class Command : IRequest<Result<FeatureToggleDto>>
    {
        public required CreateFeatureToggleDto Dto { get; set; }
    }

    internal sealed class Handler(
        AppDbContext context,
        IMapper mapper,
        IUserAccessor userAccessor) : IRequestHandler<Command, Result<FeatureToggleDto>>
    {
        public async Task<Result<FeatureToggleDto>> Handle(Command request, CancellationToken ct)
        {
            CreateFeatureToggleDto dto = request.Dto;

            if (dto.EffectiveTo.HasValue && dto.EffectiveFrom.HasValue
                && dto.EffectiveTo <= dto.EffectiveFrom)
                return Result<FeatureToggleDto>.Failure("EffectiveTo must be after EffectiveFrom.", 400);

            bool nameExists = await context.FeatureToggles
                .AnyAsync(ft => ft.FeatureName == dto.FeatureName, ct);

            if (nameExists)
                return Result<FeatureToggleDto>.Failure($"A feature toggle with name '{dto.FeatureName}' already exists.", 409);

            Guid userId = userAccessor.GetUserId();

            FeatureToggle toggle = new()
            {
                FeatureName = dto.FeatureName,
                IsEnabled = dto.IsEnabled,
                Description = string.IsNullOrWhiteSpace(dto.Description) ? null : dto.Description,
                EffectiveFrom = dto.EffectiveFrom,
                EffectiveTo = dto.EffectiveTo,
                Scope = string.IsNullOrWhiteSpace(dto.Scope) ? null : dto.Scope,
                ScopeValue = string.IsNullOrWhiteSpace(dto.ScopeValue) ? null : dto.ScopeValue,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                UpdatedBy = userId
            };

            context.FeatureToggles.Add(toggle);
            bool success = await context.SaveChangesAsync(ct) > 0;

            if (!success)
                return Result<FeatureToggleDto>.Failure("Failed to create feature toggle.", 500);

            FeatureToggleDto result = await context.FeatureToggles
                .AsNoTracking()
                .Where(ft => ft.Id == toggle.Id)
                .ProjectTo<FeatureToggleDto>(mapper.ConfigurationProvider)
                .FirstAsync(ct);

            return Result<FeatureToggleDto>.Success(result);
        }
    }
}
