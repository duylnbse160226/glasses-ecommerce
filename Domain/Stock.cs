using System;
using System.ComponentModel.DataAnnotations;

namespace Domain;

public class Stock
{
    public string Id { get; set; } = Guid.CreateVersion7(TimeProvider.System.GetUtcNow()).ToString();

    public required string ProductVariantId { get; set; }

    public required int QuantityOnHand { get; set; }

    public required int QuantityReserved { get; set; }

    public required int QuantityAvailable { get; set; }

    [MaxLength(500)]
    public string? Notes { get; set; }

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public string? UpdatedBy { get; set; }

    // Navigation properties
    public ProductVariant ProductVariant { get; set; } = null!;

    public User? UpdatedByUser { get; set; }

    // Computed property (not mapped)
    public int ActualAvailable => QuantityOnHand - QuantityReserved;
}
