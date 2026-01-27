using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain;

public enum PromotionType
{
    Percentage = 0,
    FixedAmount = 1,
    FreeShipping = 2
}

public class Promotion
{
    public string Id { get; set; } = Guid.CreateVersion7(TimeProvider.System.GetUtcNow()).ToString();

    [MaxLength(50)]
    public required string PromoCode { get; set; }
    [MaxLength(200)]
    public required string PromoName { get; set; }

    [MaxLength(500)]
    public string? Description { get; set; }

    public PromotionType PromotionType { get; set; } // PERCENTAGE, FIXED_AMOUNT, FREE_SHIPPING

    [Column(TypeName = "decimal(10,2)")]
    public decimal DiscountValue { get; set; }

    [Column(TypeName = "decimal(10,2)")]
    public decimal? MaxDiscountValue { get; set; }

    public int? UsageLimit { get; set; }

    public int? UsageLimitPerCustomer { get; set; }

    public DateTime ValidFrom { get; set; }

    public DateTime ValidTo { get; set; }

    // Navigation properties
    public ICollection<PromoUsageLog> UsageLogs { get; set; } = [];
}
