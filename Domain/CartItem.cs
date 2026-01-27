using System;

namespace Domain;

public class CartItem
{
    public string Id { get; set; } = Guid.CreateVersion7(TimeProvider.System.GetUtcNow()).ToString();
    public required string CartId { get; set; }

    public required string ProductVariantId { get; set; }

    public required int Quantity { get; set; }

    // Navigation properties
    public Cart Cart { get; set; } = null!;
    public ProductVariant ProductVariant { get; set; } = null!;
}
