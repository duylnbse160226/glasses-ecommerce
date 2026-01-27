using System;

namespace Domain;

public enum TransactionType
{
    Unknown = 0,
    Inbound = 1,
    Outbound = 2,
    Adjustment = 3
}

public enum ReferenceType
{
    Order = 1,
    Return = 2,
    Supplier = 3,
    Adjustment = 4
}

public enum InventoryTransactionStatus
{
    Pending = 0,
    Completed = 1,
}

public class InventoryTransaction
{
    public string Id { get; set; } = Guid.CreateVersion7(TimeProvider.System.GetUtcNow()).ToString();

    public required string UserId { get; set; }

    public required string ProductVariantId { get; set; }

    public TransactionType TransactionType { get; set; } = TransactionType.Inbound;

    public required int Quantity { get; set; }

    public ReferenceType ReferenceType { get; set; } = ReferenceType.Order;

    public string? ReferenceId { get; set; }

    public InventoryTransactionStatus Status { get; set; } = InventoryTransactionStatus.Pending;//Pending, Completed

    public string? Notes { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public string? CreatedBy { get; set; }

    public DateTime? ApprovedAt { get; set; }

    public string? ApprovedBy { get; set; }

    // Navigation properties
    public User User { get; set; } = null!;

    public ProductVariant ProductVariant { get; set; } = null!;
    
    public User? Creator { get; set; }

    public User? Approver { get; set; }
}
