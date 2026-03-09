using Application.Core;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.FeatureToggles.Queries;

public sealed class CheckFeatureEnabled
{
    public sealed class Query : IRequest<Result<bool>>
    {
        public required string FeatureName { get; set; }
        public string? Scope { get; set; }
        public string? ScopeValue { get; set; }
    }

    internal sealed class Handler(AppDbContext context)
        : IRequestHandler<Query, Result<bool>>
    {
        public async Task<Result<bool>> Handle(Query request, CancellationToken ct)
        {
            IQueryable<FeatureToggle> query = context.FeatureToggles
                .AsNoTracking()
                .Where(ft => ft.FeatureName == request.FeatureName);

            if (!string.IsNullOrWhiteSpace(request.Scope))
                query = query.Where(ft => ft.Scope == request.Scope && ft.ScopeValue == request.ScopeValue);
            else
                query = query.Where(ft => ft.Scope == null);

            FeatureToggle? toggle = await query.FirstOrDefaultAsync(ct);

            // Fail-safe default: return false when toggle is not found
            if (toggle == null)
                return Result<bool>.Success(false);

            DateTime utcNow = DateTime.UtcNow;
            bool isEffective = toggle.IsEnabled
                && (toggle.EffectiveFrom == null || toggle.EffectiveFrom <= utcNow)
                && (toggle.EffectiveTo == null || toggle.EffectiveTo > utcNow);

            return Result<bool>.Success(isEffective);
        }
    }
}
