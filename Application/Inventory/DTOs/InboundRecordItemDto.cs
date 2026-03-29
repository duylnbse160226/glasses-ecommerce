namespace Application.Inventory.DTOs;

//Dto Response cho từng item trong phiếu nhập kho
public sealed class InboundRecordItemDto
{
    public Guid Id { get; set; }
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
