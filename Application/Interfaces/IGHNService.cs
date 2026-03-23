using Application.Orders.DTOs;

namespace Application.Interfaces;

public interface IGHNService
{
    Task<GHNCreateOrderResponseDto> CreateShippingOrderAsync(GHNCreateOrderRequestDto request);
    Task<decimal> CalculateShippingFeeAsync(int toDistrictId, string toWardCode, int weight = 200, decimal insuranceValue = 0);
    Task<string> GetOrderPrintUrlAsync(string orderCode);

    // Master data — proxied to keep GHN token server-side
    Task<IReadOnlyList<GHNProvinceDto>> GetProvincesAsync(CancellationToken ct = default);
    Task<IReadOnlyList<GHNDistrictDto>> GetDistrictsAsync(int provinceId, CancellationToken ct = default);
    Task<IReadOnlyList<GHNWardDto>> GetWardsAsync(int districtId, CancellationToken ct = default);
}
