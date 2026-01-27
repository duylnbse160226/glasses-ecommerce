using System;
using Application.Activities.DTOs;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities.Commands;

public class CreateActivity
{
    public class Command : IRequest<Result<string>>
    {
        public required CreateActivityDto ActivityDto { get; set; }
    }

    public class Handler(AppDbContext context, IMapper mapper, IUserAccessor userAccessor) : IRequestHandler<Command, Result<string>>
    {
        public async Task<Result<string>> Handle(Command request, CancellationToken cancellationToken)
        {

            var user = await userAccessor.GetUserAsync();
            
            var activity = mapper.Map<Activity>(request.ActivityDto);
            //Don't use AddAsync for this case, just use AddAsync when use SequenceHiLo ID(suitable for bulk insert)
            //Add just tracking entity in memory, don't work with database
            context.Activities.Add(activity);

            var attendee =  new ActivityAttendee
            {
                ActivityId = activity.Id,
                UserId = user.Id,
                IsHost = true
            };

            activity.Attendees.Add(attendee);

            var isSuccess = await context.SaveChangesAsync(cancellationToken) > 0;

            if (!isSuccess) return Result<string>.Failure("Failed to create the activity", 400);

            return Result<string>.Success(activity.Id);
        }
    }
}
