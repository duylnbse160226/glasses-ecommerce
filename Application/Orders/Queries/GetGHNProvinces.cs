using Application.Core;
using Application.Interfaces;
using Application.Orders.DTOs;
using MediatR;

namespace Application.Orders.Queries;

public sealed class GetGHNProvinces
{
    public sealed class Query : IRequest<Result<IReadOnlyList<GHNProvinceDto>>> { }

    internal sealed class Handler(IGHNService ghnService)
        : IRequestHandler<Query, Result<IReadOnlyList<GHNProvinceDto>>>
    {
        public async Task<Result<IReadOnlyList<GHNProvinceDto>>> Handle(Query request, CancellationToken ct)
        {
            try
            {
                return Result<IReadOnlyList<GHNProvinceDto>>.Success(await ghnService.GetProvincesAsync());
            }
            catch (Exception ex)
            {
                return Result<IReadOnlyList<GHNProvinceDto>>.Failure(ex.Message, 400);
            }
        }
    }
}
