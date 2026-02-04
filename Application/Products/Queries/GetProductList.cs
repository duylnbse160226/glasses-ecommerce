using System.Text.Json.Serialization;
using Application.Core;
using Application.Products.DTOs;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Products.Queries;

public sealed class GetProductList
{
    public enum SortByOption
    {
        CreatedAt,
        Price,
        Name
    }

    public enum SortOrderOption
    {
        Asc,
        Desc
    }

    public sealed class Query : IRequest<Result<PagedResult<ProductListDto>>>
    {
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public List<Guid>? CategoryIds { get; set; }
        public string? Brand { get; set; }
        public ProductStatus? Status { get; set; }
        public ProductType? Type { get; set; }
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
        public string? SearchTerm { get; set; }
        
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public SortByOption SortBy { get; set; } = SortByOption.CreatedAt;
        
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public SortOrderOption SortOrder { get; set; } = SortOrderOption.Desc;
    }

    public sealed class Handler(AppDbContext context, IMapper mapper) 
        : IRequestHandler<Query, Result<PagedResult<ProductListDto>>>
    {
        public async Task<Result<PagedResult<ProductListDto>>> Handle(Query request, CancellationToken cancellationToken)
        {
            var query = context.Products
                .Include(p => p.Category)
                .Include(p => p.Variants)
                    .ThenInclude(v => v.Stock)
                .Include(p => p.Images)
                .Where(p => p.Status == ProductStatus.Active)
                .AsQueryable();

            // Apply filters
            if (request.CategoryIds != null && request.CategoryIds.Count > 0)
            {
                query = query.Where(p => request.CategoryIds.Contains(p.CategoryId));
            }

            if (!string.IsNullOrWhiteSpace(request.Brand))
            {
                query = query.Where(p => p.Brand != null && p.Brand.Contains(request.Brand));
            }

            if (request.Status.HasValue)
            {
                query = query.Where(p => p.Status == request.Status.Value);
            }

            if (request.Type.HasValue)
            {
                query = query.Where(p => p.Type == request.Type.Value);
            }

            if (!string.IsNullOrWhiteSpace(request.SearchTerm))
            {
                var searchLower = request.SearchTerm.ToLower();
                query = query.Where(p => 
                    p.ProductName.Contains(searchLower, StringComparison.CurrentCultureIgnoreCase) ||
                    (p.Description != null && p.Description.Contains(searchLower, StringComparison.CurrentCultureIgnoreCase)) ||
                    (p.Brand != null && p.Brand.Contains(searchLower, StringComparison.CurrentCultureIgnoreCase))
                );
            }

            // Price range filtering (based on variant prices)
            if (request.MinPrice.HasValue)
            {
                query = query.Where(p => p.Variants.Any(v => v.Price >= request.MinPrice.Value));
            }

            if (request.MaxPrice.HasValue)
            {
                query = query.Where(p => p.Variants.Any(v => v.Price <= request.MaxPrice.Value));
            }

            // Get total count before pagination
            var totalCount = await query.CountAsync(cancellationToken);

            // Apply sorting
            query = request.SortBy switch
            {
                SortByOption.Price => request.SortOrder == SortOrderOption.Asc
                    ? query.OrderBy(p => p.Variants.Min(v => v.Price))
                    : query.OrderByDescending(p => p.Variants.Min(v => v.Price)),
                SortByOption.Name => request.SortOrder == SortOrderOption.Asc
                    ? query.OrderBy(p => p.ProductName)
                    : query.OrderByDescending(p => p.ProductName),
                _ => request.SortOrder == SortOrderOption.Asc
                    ? query.OrderBy(p => p.CreatedAt)
                    : query.OrderByDescending(p => p.CreatedAt)
            };

            // Apply pagination
            var items = await query
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .ProjectTo<ProductListDto>(mapper.ConfigurationProvider)
                .AsNoTracking()
                .ToListAsync(cancellationToken);

            var pagedResult = new PagedResult<ProductListDto>
            {
                Items = items,
                TotalCount = totalCount,
                PageNumber = request.PageNumber,
                PageSize = request.PageSize
            };

            return Result<PagedResult<ProductListDto>>.Success(pagedResult);
        }
    }
}
