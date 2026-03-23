namespace Application.Orders.DTOs;

/// <summary>
/// Data transfer object for the GHN order creation API request.
/// </summary>
public sealed class GHNCreateOrderRequestDto
{
    public string ToName { get; set; } = string.Empty;
    public string ToPhone { get; set; } = string.Empty;
    public string ToAddress { get; set; } = string.Empty;
    public string ToWardCode { get; set; } = string.Empty;
    public int ToDistrictId { get; set; }
    public int Weight { get; set; } = 200; // default 200g
    public int Length { get; set; } = 20;  // default 20cm
    public int Width { get; set; } = 15;   // default 15cm
    public int Height { get; set; } = 10;  // default 10cm
    public int ServiceTypeId { get; set; } = 2; // 2: Chuyển phát truyền thống (E-commerce)
    public int PaymentTypeId { get; set; } = 1; // 1: Người bán trả cước
    public string RequiredNote { get; set; } = "CHOXEMHANGKHONGTHU"; // Cho xem hàng không cho thử
    public List<GHNItemDto> Items { get; set; } = new();
    public string ClientOrderCode { get; set; } = string.Empty;
    public decimal CodAmount { get; set; }
    public decimal? InsuranceValue { get; set; }
}
