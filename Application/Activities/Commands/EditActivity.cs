using System;
using Application.Activities.DTOs;
using Application.Core;
using AutoMapper;
using MediatR;
using Persistence;

namespace Application.Activities.Commands;

public class EditActivity
{
    public class Command : IRequest<Result<Unit>>
    {
        public required EditActivityDto ActivityDto { get; set; }
    }

    public class Handler(AppDbContext context, IMapper mapper) : IRequestHandler<Command, Result<Unit>>
    {
        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            var activity = await context.Activities.FindAsync([request.ActivityDto.Id], cancellationToken);

            if (activity == null) return Result<Unit>.Failure("Activity Not Found.", 404);

            mapper.Map(request.ActivityDto, activity);
            
            var isSuccess = await context.SaveChangesAsync(cancellationToken) > 0;
            //Unsuccessful update when have error from database or no changes detected by EF Core
            if (!isSuccess) return Result<Unit>.Failure("Failed to update the activity", 400);

            return Result<Unit>.Success(Unit.Value);
        }
    }
}
