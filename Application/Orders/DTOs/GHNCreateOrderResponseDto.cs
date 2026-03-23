namespace Application.Orders.DTOs;

/// <summary>
/// Data transfer object for the response from GHN after creating an order.
/// </summary>
public sealed class GHNCreateOrderResponseDto
{
    public string OrderCode { get; set; } = string.Empty;
    public int TotalFee { get; set; }
    public string ExpectedDeliveryTime { get; set; } = string.Empty;
}
