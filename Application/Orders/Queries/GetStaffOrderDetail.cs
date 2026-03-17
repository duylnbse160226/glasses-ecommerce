using Application.Core;
using Application.Interfaces;
using Application.Orders.DTOs;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Orders.Queries;

public sealed class GetStaffOrderDetail
{
    public sealed class Query : IRequest<Result<StaffOrderDto>>
    {
        public required Guid Id { get; set; }
    }

    internal sealed class Handler(AppDbContext context, IMapper mapper, IUserAccessor userAccessor)
        : IRequestHandler<Query, Result<StaffOrderDto>>
    {
        public async Task<Result<StaffOrderDto>> Handle(Query request, CancellationToken ct)
        {
            Guid staffUserId = userAccessor.GetUserId();

            StaffOrderDto? order = await context.Orders
                .AsNoTracking()
                .Where(o => o.Id == request.Id && (o.CreatedBySalesStaff == staffUserId ||
                           o.OrderSource == OrderSource.Online))  // Sales staff can view all online orders
                .Include(o => o.Address)
                .Include(o => o.PromoUsageLogs)
                  .ThenInclude(p => p.Promotion)
                .Include(o => o.SalesStaff)
                .Include(o => o.OrderItems)
                  .ThenInclude(oi => oi.ProductVariant)
                  .ThenInclude(pv => pv.Product)
                  .ThenInclude(p => p.Images)
                .Include(o => o.Payments)
                .Include(o => o.Prescriptions)
                .Include(o => o.ShipmentInfo)
                .Include(o => o.StatusHistories)
                .AsSplitQuery()
                .ProjectTo<StaffOrderDto>(mapper.ConfigurationProvider)
                .FirstOrDefaultAsync(ct);

            if (order == null)
                return Result<StaffOrderDto>.Failure("Order not found.", 404);

            return Result<StaffOrderDto>.Success(order);
        }
    }
}
