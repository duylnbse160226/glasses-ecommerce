using System;
using System.ComponentModel.DataAnnotations;

namespace Domain;

public class TicketAttachment
{
    public string Id { get; set; } = Guid.CreateVersion7(TimeProvider.System.GetUtcNow()).ToString();
    public required string TicketId { get; set; }

    [MaxLength(200)]
    public required string FileName { get; set; }

    [MaxLength(500)]
    public required string FileUrl { get; set; }

    [MaxLength(50)]
    public string? FileType { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? DeletedAt { get; set; }

    public string? DeletedBy { get; set; }

    // Navigation properties
    public AfterSalesTicket Ticket { get; set; } = null!;

    public User? Deleter { get; set; }
}
