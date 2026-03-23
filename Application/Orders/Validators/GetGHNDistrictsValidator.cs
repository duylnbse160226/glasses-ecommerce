using Application.Orders.Queries;
using FluentValidation;

namespace Application.Orders.Validators;

public sealed class GetGHNDistrictsValidator : AbstractValidator<GetGHNDistricts.Query>
{
    public GetGHNDistrictsValidator()
    {
        RuleFor(x => x.ProvinceId)
            .GreaterThan(0)
            .WithMessage("ProvinceId must be greater than 0.");
    }
}
