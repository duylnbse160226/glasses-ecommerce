namespace Application.Orders.DTOs;
/// <summary>
/// DTO for GHN district master data
/// </summary>
public sealed record GHNDistrictDto(int DistrictId, string DistrictName, int ProvinceId);
