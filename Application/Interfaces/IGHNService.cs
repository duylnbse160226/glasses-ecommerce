using Application.Orders.DTOs;

namespace Application.Interfaces;

public interface IGHNService
{
    Task<GHNCreateOrderResponseDto> CreateShippingOrderAsync(GHNCreateOrderRequestDto request);
    Task<string> GetOrderPrintUrlAsync(string orderCode);
}
