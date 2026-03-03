using Application.Admin.DTOs;
using Application.Core;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Application.Admin.Queries;

public sealed class GetAllRoles
{
    public sealed class Query : IRequest<Result<List<RoleDto>>>
    {
    }

    internal sealed class Handler(RoleManager<IdentityRole<Guid>> roleManager)
        : IRequestHandler<Query, Result<List<RoleDto>>>
    {
        public async Task<Result<List<RoleDto>>> Handle(Query request, CancellationToken cancellationToken)
        {
            List<IdentityRole<Guid>> roles = roleManager.Roles.ToList();

            List<RoleDto> roleDtos = roles.Select(r => new RoleDto
            {
                Id = r.Id,
                Name = r.Name ?? string.Empty,
                UserCount = 0 // Will be populated from UserManager if needed
            }).ToList();

            return Result<List<RoleDto>>.Success(roleDtos);
        }
    }
}
