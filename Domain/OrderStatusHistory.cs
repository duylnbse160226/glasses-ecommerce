using System;
using System.ComponentModel.DataAnnotations;

namespace Domain;

public class OrderStatusHistory
{
    public string Id { get; set; } = Guid.CreateVersion7(TimeProvider.System.GetUtcNow()).ToString();

    public required string OrderId { get; set; }

    [MaxLength(30)]
    public required string FromStatus { get; set; } = null!;

    [MaxLength(30)]
    public required string ToStatus { get; set; }

    [MaxLength(500)]
    public string? Notes { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation property
    public Order Order { get; set; } = null!;

}
