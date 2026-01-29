using System;

namespace Domain;

public enum AfterSalesTicketType
{
    Unknown = 0,
    Return = 1,
    Warranty = 2,
    Refund = 3
}

public enum AfterSalesTicketStatus
{
    Pending = 1,
    InProgress = 2,
    Resolved = 3,
    Rejected = 4,
    Closed = 5
}

public class AfterSalesTicket
{
    public string Id { get; set; } = Guid.CreateVersion7(TimeProvider.System.GetUtcNow()).ToString();

    public required string OrderId { get; set; }

    public string? OrderItemId { get; set; } // NULL if the ticket is for the whole order

    public required string CustomerId { get; set; }

    public AfterSalesTicketType TicketType { get; set; } = AfterSalesTicketType.Unknown; // RETURN, WARRANTY, REFUND

    public AfterSalesTicketStatus TicketStatus { get; set; } = AfterSalesTicketStatus.Pending; // PENDING, IN_PROGRESS, RESOLVED, REJECTED, CLOSED

    public required string Reason { get; set; } = null!;

    public string? RequestedAction { get; set; }

    public decimal? RefundAmount { get; set; }

    public bool IsRequiredEvidence { get; set; } = true;

    public string? AssignedTo { get; set; }

    public string? PolicyViolation { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? ResolvedAt { get; set; }

    // Navigation properties
    public Order Order { get; set; } = null!;
    public OrderItem? OrderItem { get; set; }
    public User Customer { get; set; } = null!;
    public User? AssignedStaff { get; set; }

    public ICollection<TicketAttachment> Attachments { get; set; } = new List<TicketAttachment>();

}
