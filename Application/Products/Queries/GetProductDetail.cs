using Application.Core;
using Application.Products.DTOs;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Products.Queries;

public sealed class GetProductDetail
{
    public sealed class Query : IRequest<Result<ProductDto>>
    {
        public required Guid Id { get; set; }
    }

    public sealed class Handler(AppDbContext context, IMapper mapper) 
        : IRequestHandler<Query, Result<ProductDto>>
    {
        public async Task<Result<ProductDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            var product = await context.Products
                .Where(p => p.Id == request.Id)
                .ProjectTo<ProductDto>(mapper.ConfigurationProvider)
                .AsNoTracking()
                .FirstOrDefaultAsync(cancellationToken);

            if (product == null)
            {
                return Result<ProductDto>.Failure("Product not found.", 404);
            }

            return Result<ProductDto>.Success(product);
        }
    }
}
