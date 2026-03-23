using Application.Core;
using Application.Interfaces;
using Application.Orders.DTOs;
using MediatR;

namespace Application.Orders.Queries;

public sealed class GetGHNDistricts
{
    public sealed class Query : IRequest<Result<IReadOnlyList<GHNDistrictDto>>>
    {
        public int ProvinceId { get; set; }
    }

    internal sealed class Handler(IGHNService ghnService)
        : IRequestHandler<Query, Result<IReadOnlyList<GHNDistrictDto>>>
    {
        public async Task<Result<IReadOnlyList<GHNDistrictDto>>> Handle(Query request, CancellationToken ct)
        {
            try
            {
                return Result<IReadOnlyList<GHNDistrictDto>>.Success(
                    await ghnService.GetDistrictsAsync(request.ProvinceId, ct));
            }
            catch (ArgumentException ex)
            {
                return Result<IReadOnlyList<GHNDistrictDto>>.Failure(ex.Message, 400);
            }
            catch (Exception ex)
            {
                return Result<IReadOnlyList<GHNDistrictDto>>.Failure($"Shipping service unavailable: {ex.Message}", 503);
            }
        }
    }
}
