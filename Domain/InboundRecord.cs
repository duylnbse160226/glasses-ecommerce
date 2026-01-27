using System;
using System.ComponentModel.DataAnnotations;

namespace Domain;

public enum SourceType
{
    Unknown = 0,
    Supplier = 1,
    Return = 2,
    Adjustment = 3
}



public class InboundRecord
{
    public string Id { get; set; } = Guid.CreateVersion7(TimeProvider.System.GetUtcNow()).ToString();

    [MaxLength(20)]
    public required SourceType SourceType { get; set; }// Supplier, Return, Adjustment

    [MaxLength(100)]
    public string? SourceReference { get; set; }

    [MaxLength(20)]
    public required string Status { get; set; } = "PENDING_APPROVAL";

    [Required]
    public int TotalItems { get; set; }

    [MaxLength(500)]
    public string? Notes { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public string? CreatedBy { get; set; }

    public DateTime? ApprovedAt { get; set; }

    public string? ApprovedBy { get; set; }

    public DateTime? RejectedAt { get; set; }

    [MaxLength(500)]
    public string? RejectionReason { get; set; }

    // Navigation properties
    public User? Creator { get; set; }
    public User? Approver { get; set; }
    public ICollection<InboundRecordItem> Items { get; set; } = [];
}
