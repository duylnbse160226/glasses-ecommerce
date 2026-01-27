using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain;

public enum EyeType
{
    Unknown = 0,
    Left = 1,
    Right = 2
}

public class PrescriptionDetail
{
    public string Id { get; set; } = Guid.CreateVersion7(TimeProvider.System.GetUtcNow()).ToString();

    public required string PrescriptionId { get; set; }

    public EyeType Eye { get; set; } // Left, Right

    [Column(TypeName = "decimal(5,2)")]
    public decimal? SPH { get; set; }

    [Column(TypeName = "decimal(5,2)")]
    public decimal? CYL { get; set; }

    public int? AXIS { get; set; }

    [Column(TypeName = "decimal(5,2)")]
    public decimal? PD { get; set; }

    [Column(TypeName = "decimal(5,2)")]
    public decimal? ADD { get; set; }

    // Navigation property
    public Prescription Prescription { get; set; } = null!;

}
