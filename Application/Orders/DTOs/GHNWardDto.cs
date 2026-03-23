namespace Application.Orders.DTOs;
/// <summary>
/// DTO for GHN ward master data        
/// </summary>
public sealed record GHNWardDto(string WardCode, string WardName, int DistrictId);
