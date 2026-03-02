using Application.Admin.DTOs;
using Application.Core;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Admin.Queries;

public sealed class GetAllUsers
{
    public sealed class Query : IRequest<Result<List<UserRoleDto>>>
    {
    }

    internal sealed class Handler(UserManager<User> userManager)
        : IRequestHandler<Query, Result<List<UserRoleDto>>>
    {
        public async Task<Result<List<UserRoleDto>>> Handle(Query request, CancellationToken cancellationToken)
        {
            List<User> users = await userManager.Users.ToListAsync(cancellationToken);

            List<UserRoleDto> userRoleDtos = new();

            foreach (User user in users)
            {
                List<string> roles = (await userManager.GetRolesAsync(user)).ToList();
                userRoleDtos.Add(new UserRoleDto
                {
                    UserId = user.Id,
                    UserName = user.UserName ?? string.Empty,
                    Email = user.Email ?? string.Empty,
                    DisplayName = user.DisplayName ?? string.Empty,
                    Roles = roles
                });
            }

            return Result<List<UserRoleDto>>.Success(userRoleDtos);
        }
    }
}
