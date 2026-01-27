using System;
using System.ComponentModel.DataAnnotations;

namespace Domain;

public class FeatureToggle
{
    public string Id { get; set; } = Guid.CreateVersion7(TimeProvider.System.GetUtcNow()).ToString();
    [MaxLength(100)]
    public required string FeatureName { get; set; }

    public bool IsEnabled { get; set; } = true;

    [MaxLength(500)]
    public string? Description { get; set; }

    public DateTime? EffectiveFrom { get; set; }

    public DateTime? EffectiveTo { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public string? UpdatedBy { get; set; }

    [MaxLength(50)]
    public string? Scope { get; set; }

    [MaxLength(200)]
    public string? ScopeValue { get; set; }

    // Navigation property
    public User? Updater { get; set; }
}
