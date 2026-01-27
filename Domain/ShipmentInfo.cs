using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain;

public enum ShippingCarrier
{
    Unknown = 0,
    GHN = 1,      // Giao Hàng Nhanh
    GHTK = 2      // Giao Hàng Tiết Kiệm
}

public class ShipmentInfo
{
    public string Id { get; set; } = Guid.CreateVersion7(TimeProvider.System.GetUtcNow()).ToString();
    public required string OrderId { get; set; }

    public ShippingCarrier CarrierName { get; set; } // GHN, GHTK

    [MaxLength(100)]
    public required string TrackingCode { get; set; }

    [MaxLength(500)]
    public string? TrackingUrl { get; set; }

    public DateTime? ShippedAt { get; set; }

    public DateTime? EstimatedDeliveryAt { get; set; }

    public DateTime? ActualDeliveryAt { get; set; }

    [Column(TypeName = "decimal(10,2)")]
    public decimal? PackageWeight { get; set; }

    [MaxLength(100)]
    public string? PackageDimensions { get; set; }

    [MaxLength(500)]
    public string? ShippingNotes { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public string? CreatedBy { get; set; }

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public Order Order { get; set; } = null!;
    public User? Creator { get; set; }
}
