using Application.Core;
using Application.Orders.DTOs;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Orders.Queries;

public sealed class GetOperationsOrders
{
    public sealed class Query : IRequest<Result<PagedResult<StaffOrderListDto>>>
    {
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public OrderStatus? Status { get; set; }
        public OrderType? OrderType { get; set; }
        public OrderSource? OrderSource { get; set; }
    }

    internal sealed class Handler(AppDbContext context, IMapper mapper)
        : IRequestHandler<Query, Result<PagedResult<StaffOrderListDto>>>
    {
        public async Task<Result<PagedResult<StaffOrderListDto>>> Handle(Query request, CancellationToken ct)
        {
            if (request.PageNumber < 1 || request.PageSize < 1 || request.PageSize > 100)
                return Result<PagedResult<StaffOrderListDto>>
                    .Failure("Invalid pagination parameters.", 400);

            IQueryable<Order> query = context.Orders.AsNoTracking();

            if (request.Status.HasValue)
                query = query.Where(o => o.OrderStatus == request.Status.Value);

            if (request.OrderType.HasValue)
                query = query.Where(o => o.OrderType == request.OrderType.Value);

            if (request.OrderSource.HasValue)
                query = query.Where(o => o.OrderSource == request.OrderSource.Value);

            int totalCount = await query.CountAsync(ct);

            // Pre-compute expected stock date on the app side — cannot be translated to SQL.
            string expectedStockDate = DateTime.UtcNow.AddDays(14).ToString("O");

<<<<<<< Duy
            // Execute query first to load orders, then map in-memory to avoid complex SQL translation
            // of nested collection projections (which EF Core struggles with).
            List<Order> orders = await query
                .Include(o => o.Prescriptions)
                    .ThenInclude(p => p.Details)
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.ProductVariant)
                        .ThenInclude(pv => pv!.Product)
                .Include(o => o.Address)
                .Include(o => o.User)
                .Include(o => o.SalesStaff)
                .Include(o => o.PromoUsageLogs)
=======
            // Load with Include chains before ProjectTo to ensure all navigation properties are loaded.
            List<Order> orders = await query
                .Include(o => o.PromoUsageLogs)
                .Include(o => o.Address)
                .Include(o => o.User)
                .Include(o => o.SalesStaff)
                .Include(o => o.OrderItems)
                  .ThenInclude(oi => oi.ProductVariant)
                  .ThenInclude(pv => pv.Product)
                .Include(o => o.Prescriptions)
>>>>>>> main
                .Include(o => o.ShipmentInfo)
                .AsSplitQuery()
                .OrderByDescending(o => o.CreatedAt)
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync(ct);
<<<<<<< Duy
            // Map to DTO in memory
            List<StaffOrderListDto> mappedOrders = orders.Select(o => new StaffOrderListDto
            {
                Id = o.Id,
                OrderNumber = "ORD-" + o.Id.ToString().Substring(0, 8).ToUpperInvariant(),
                OrderSource = o.OrderSource.ToString(),
                OrderType = o.OrderType.ToString(),
                OrderStatus = o.OrderStatus.ToString(),
                TotalAmount = o.TotalAmount,
                FinalAmount = o.TotalAmount + o.ShippingFee - o.PromoUsageLogs.Sum(p => p.DiscountApplied),
                WalkInCustomerName = o.WalkInCustomerName,
                WalkInCustomerPhone = o.WalkInCustomerPhone,
                CustomerName = o.Address != null ? o.Address.RecipientName : o.WalkInCustomerName,
                CustomerPhone = o.Address != null ? o.Address.RecipientPhone : o.WalkInCustomerPhone,
                CustomerEmail = o.User != null ? o.User.Email : null,
                ShippingAddress = o.Address != null
                    ? $"{o.Address.Venue}, {o.Address.Ward}, {o.Address.District}, {o.Address.City}"
                    : null,
                CreatedBySalesStaff = o.CreatedBySalesStaff,
                SalesStaffName = o.SalesStaff != null ? o.SalesStaff.DisplayName : null,
                ItemCount = o.OrderItems.Count,
                CreatedAt = o.CreatedAt,
                ExpectedStockDate = o.OrderType == OrderType.PreOrder ? expectedStockDate : null,
                PrescriptionStatus = o.Prescriptions.Any() ? "lens_ordered" : null,
                ShipmentId = o.ShipmentInfo != null ? o.ShipmentInfo.Id : (Guid?)null,
                TrackingNumber = o.ShipmentInfo != null ? o.ShipmentInfo.TrackingCode : null,
                Carrier = o.ShipmentInfo != null ? o.ShipmentInfo.CarrierName.ToString() : null,
                Items = o.OrderItems.Select(oi => new StaffOrderItemDto
=======

            // Map to DTO using AutoMapper for computed/complex fields, then post-process ignored fields.
            List<StaffOrderListDto> mappedOrders = orders
                .AsQueryable()
                .ProjectTo<StaffOrderListDto>(mapper.ConfigurationProvider)
                .ToList();

            // Populate ignored fields that cannot be translated to SQL/mapping.
            foreach (StaffOrderListDto dto in mappedOrders)
            {
                Order order = orders.First(o => o.Id == dto.Id);
                dto.ExpectedStockDate = order.OrderType == OrderType.PreOrder ? expectedStockDate : null;
                dto.PrescriptionStatus = order.Prescriptions.Any() ? "lens_ordered" : null;
                dto.ShipmentId = order.ShipmentInfo != null ? order.ShipmentInfo.Id : null;
                dto.TrackingNumber = order.ShipmentInfo != null ? order.ShipmentInfo.TrackingCode : null;
                dto.Carrier = order.ShipmentInfo != null ? order.ShipmentInfo.CarrierName.ToString() : null;
                dto.Items = order.OrderItems.Select(oi => new StaffOrderItemDto
>>>>>>> main
                {
                    Id = oi.Id,
                    ProductVariantId = oi.ProductVariantId,
                    ProductName = oi.ProductVariant != null && oi.ProductVariant.Product != null
                        ? oi.ProductVariant.Product.ProductName
                        : "Unknown",
                    Sku = oi.ProductVariant != null ? oi.ProductVariant.SKU : "N/A",
                    Quantity = oi.Quantity,
                    Price = oi.UnitPrice,
                    PrescriptionId = oi.PrescriptionId == null ? null : oi.PrescriptionId.Value.ToString()
<<<<<<< Duy
                }).ToList(),
                Prescriptions = o.Prescriptions.Select(p => new OrderPrescriptionDto
                {
                    Id = p.Id,
                    IsVerified = p.IsVerified,
                    VerifiedAt = p.VerifiedAt,
                    VerificationNotes = p.VerificationNotes,
                    Details = p.Details.Select(d => new PrescriptionDetailOutputDto
                    {
                        Id = d.Id,
                        Eye = d.Eye.ToString(),
                        SPH = d.SPH,
                        CYL = d.CYL,
                        AXIS = d.AXIS,
                        PD = d.PD,
                        ADD = d.ADD,
                    }).ToList()
                }).ToList()
            }).ToList();
=======
                }).ToList();
            }

>>>>>>> main
            PagedResult<StaffOrderListDto> result = new()
            {
                Items = mappedOrders,
                TotalCount = totalCount,
                PageNumber = request.PageNumber,
                PageSize = request.PageSize
            };

            return Result<PagedResult<StaffOrderListDto>>.Success(result);
        }
    }
}
