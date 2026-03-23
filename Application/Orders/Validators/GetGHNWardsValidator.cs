using Application.Orders.Queries;
using FluentValidation;

namespace Application.Orders.Validators;

public sealed class GetGHNWardsValidator : AbstractValidator<GetGHNWards.Query>
{
    public GetGHNWardsValidator()
    {
        RuleFor(x => x.DistrictId)
            .GreaterThan(0)
            .WithMessage("DistrictId must be greater than 0.");
    }
}
