using System;

namespace Domain;

public class InboundRecordItem
{
    public string Id { get; set; } = Guid.CreateVersion7(TimeProvider.System.GetUtcNow()).ToString();
    public required string InboundRecordId { get; set; }

    public required string ProductVariantId { get; set; }

    public required int Quantity { get; set; }

    public string? Notes { get; set; }

    // Navigation properties
    public InboundRecord InboundRecord { get; set; } = null!;
    public ProductVariant ProductVariant { get; set; } = null!;
}
