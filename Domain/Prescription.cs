using System;
using System.ComponentModel.DataAnnotations;

namespace Domain;

public class Prescription
{
    public string Id { get; set; } = Guid.CreateVersion7(TimeProvider.System.GetUtcNow()).ToString();

    public required string OrderId { get; set; }

    public bool IsVerified { get; set; }

    public string? VerifiedBy { get; set; }

    public DateTime? VerifiedAt { get; set; }

    [MaxLength(1000)]
    public string? VerificationNotes { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public Order Order { get; set; } = null!;
    public User? Verifier { get; set; }
    public ICollection<PrescriptionDetail> Details { get; set; } = [];
}
