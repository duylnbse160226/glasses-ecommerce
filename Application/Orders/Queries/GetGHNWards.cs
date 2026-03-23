using Application.Core;
using Application.Interfaces;
using Application.Orders.DTOs;
using MediatR;

namespace Application.Orders.Queries;

public sealed class GetGHNWards
{
    public sealed class Query : IRequest<Result<IReadOnlyList<GHNWardDto>>>
    {
        public int DistrictId { get; set; }
    }

    internal sealed class Handler(IGHNService ghnService)
        : IRequestHandler<Query, Result<IReadOnlyList<GHNWardDto>>>
    {
        public async Task<Result<IReadOnlyList<GHNWardDto>>> Handle(Query request, CancellationToken ct)
        {
            try
            {
                return Result<IReadOnlyList<GHNWardDto>>.Success(
                    await ghnService.GetWardsAsync(request.DistrictId));
            }
            catch (Exception ex)
            {
                return Result<IReadOnlyList<GHNWardDto>>.Failure(ex.Message, 400);
            }
        }
    }
}
