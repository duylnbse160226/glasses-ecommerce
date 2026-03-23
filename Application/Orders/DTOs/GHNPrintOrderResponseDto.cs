namespace Application.Orders.DTOs;

/// <summary>
/// Data transfer object for the response containing the GHN print token.
/// </summary>
public sealed class GHNPrintOrderResponseDto
{
    public string Token { get; set; } = string.Empty;
}
