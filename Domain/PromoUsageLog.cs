using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain;

public class PromoUsageLog
{
    public string Id { get; set; } = Guid.CreateVersion7(TimeProvider.System.GetUtcNow()).ToString();
    public required string OrderId { get; set; }

    public required string PromotionId { get; set; }

    [Column(TypeName = "decimal(10,2)")]
    public required decimal DiscountApplied { get; set; }

    public DateTime UsedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public Order Order { get; set; } = null!;
    public Promotion Promotion { get; set; } = null!;
}
