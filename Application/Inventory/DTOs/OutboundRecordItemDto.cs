namespace Application.Inventory.DTOs;
/// <summary>
/// Dto Response cho từng item trong phiếu xuất kho
/// </summary>
public sealed class OutboundRecordItemDto
{
    public Guid TransactionId { get; set; }
    public Guid ProductVariantId { get; set; }
    public Guid? ProductId { get; set; }
    public string? ProductName { get; set; }
    public string? VariantName { get; set; }
    public string? SKU { get; set; }
    public string? ProductImageUrl { get; set; }
    public string? ProductImageAlt { get; set; }
    public int Quantity { get; set; }
    public string? Notes { get; set; }
}
