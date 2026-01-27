using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain;

public enum PaymentMethod
{
    Unknown = 0,
    Cod = 1,
    QrCode = 2,
    BankTransfer = 3
}

public enum PaymentStatus
{
    Unknown = 0,
    Pending = 1,
    Completed = 2,
    Failed = 3,
    Refunded = 4
}

public enum PaymentType
{
    Unknown = 0,
    Full = 1,
    Deposit = 2,
    Remaining = 3
}

public class Payment
{
    public string Id { get; set; } = Guid.CreateVersion7(TimeProvider.System.GetUtcNow()).ToString();
    public required string OrderId { get; set; }

    [MaxLength(20)]
    public PaymentMethod PaymentMethod { get; set; } // COD, QR_CODE, BANK_TRANSFER

    [MaxLength(20)]
    public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.Pending; // PENDING, COMPLETED, FAILED, REFUNDED

    [Column(TypeName = "decimal(10,2)")]
    public required decimal Amount { get; set; }

    [MaxLength(100)]
    public string? TransactionId { get; set; }

    public DateTime? PaymentAt { get; set; }

    public PaymentType PaymentType { get; set; } = PaymentType.Full; //FULL, DEPOSIT, REMAINING

    // Navigation properties
    public Order Order { get; set; } = null!;

    public ICollection<Refund> Refunds { get; set; } = [];

}
