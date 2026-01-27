using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain;

public enum RefundStatus
{
    Unknown = 0,
    Pending = 1,
    Approved = 2,
    Completed = 3,
    Rejected = 4
}

public class Refund
{
    public string Id { get; set; } = Guid.CreateVersion7(TimeProvider.System.GetUtcNow()).ToString();

    public required string PaymentId { get; set; }

    public RefundStatus RefundStatus { get; set; } = RefundStatus.Pending; // PENDING, APPROVED, COMPLETED, REJECTED

    [Column(TypeName = "decimal(10,2)")]
    public required decimal Amount { get; set; }

    public DateTime? RefundAt { get; set; }

    [MaxLength(500)]
    public string? RefundReason { get; set; }

    // Navigation property
    public Payment Payment { get; set; } = null!;

}
