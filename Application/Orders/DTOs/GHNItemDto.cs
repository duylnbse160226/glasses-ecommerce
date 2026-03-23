namespace Application.Orders.DTOs;

/// <summary>
/// Data transfer object representing an item within a GHN order.
/// </summary>
public sealed class GHNItemDto
{
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal Price { get; set; }
    public int Weight { get; set; } = 50;
}
