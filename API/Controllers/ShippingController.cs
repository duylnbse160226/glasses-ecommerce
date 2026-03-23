using Application.Orders.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Route("api/shipping")]
[AllowAnonymous]
public sealed class ShippingController : BaseApiController
{
    [HttpGet("fee")]
    public async Task<IActionResult> GetShippingFee(
        [FromQuery] int districtId,
        [FromQuery] string wardCode,
        [FromQuery] int weight = 200,
        [FromQuery] decimal insuranceValue = 0,
        CancellationToken ct = default)
    {
        return HandleResult(await Mediator.Send(new CalculateShippingFee.Query
        {
            DistrictId = districtId,
            WardCode = wardCode,
            Weight = weight,
            InsuranceValue = insuranceValue
        }, ct));
    }

    [HttpGet("provinces")]
    public async Task<IActionResult> GetProvinces(CancellationToken ct)
        => HandleResult(await Mediator.Send(new GetGHNProvinces.Query(), ct));

    [HttpGet("districts")]
    public async Task<IActionResult> GetDistricts([FromQuery] int provinceId, CancellationToken ct)
        => HandleResult(await Mediator.Send(new GetGHNDistricts.Query { ProvinceId = provinceId }, ct));

    [HttpGet("wards")]
    public async Task<IActionResult> GetWards([FromQuery] int districtId, CancellationToken ct)
        => HandleResult(await Mediator.Send(new GetGHNWards.Query { DistrictId = districtId }, ct));
}
