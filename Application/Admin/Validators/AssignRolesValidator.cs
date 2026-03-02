using Application.Admin.Commands;
using FluentValidation;

namespace Application.Admin.Validators;

public sealed class AssignRolesValidator : AbstractValidator<AssignRoles.Command>
{
    public AssignRolesValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty().WithMessage("User ID is required.");

        RuleFor(x => x.Roles)
            .NotNull().WithMessage("Roles list is required.")
            .NotEmpty().WithMessage("At least one role must be assigned.");

        RuleFor(x => x.Roles)
            .Custom((roles, context) =>
            {
                if (roles.Any(string.IsNullOrWhiteSpace))
                {
                    context.AddFailure("Roles list contains invalid role names.");
                }
            });
    }
}
