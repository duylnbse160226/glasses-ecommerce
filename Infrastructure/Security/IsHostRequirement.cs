using System;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Infrastructure.Security;

public class IsHostRequirement : IAuthorizationRequirement
{
}

public class IsHostRequirementHandler(AppDbContext dbContext, IHttpContextAccessor httpContextAccessor) 
    : AuthorizationHandler<IsHostRequirement>
{
    protected override async Task HandleRequirementAsync(AuthorizationHandlerContext context, IsHostRequirement requirement)
    {
        var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return; //return mean not success with requirement.

        var httpContext = httpContextAccessor.HttpContext;

        //get activity id from route
        //if the value is not string then return
        //if the value is string then assign to activityId variable
        if (httpContext?.GetRouteValue("id") is not string activityId) return;
        var attendee = await dbContext.ActivityAttendees
            .AsNoTracking().SingleOrDefaultAsync(x => x.ActivityId == activityId && x.UserId == userId);

        if(attendee == null) return;
        if(attendee.IsHost) context.Succeed(requirement);

    }
}
