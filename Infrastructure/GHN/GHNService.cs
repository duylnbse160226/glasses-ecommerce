using System.Net.Http.Json;
using System.Text.Json;
using Application.Core;
using Application.Interfaces;
using Application.Orders.DTOs;
using Microsoft.Extensions.Options;

namespace Infrastructure.GHN;

public class GHNService : IGHNService
{
    private readonly HttpClient _httpClient;
    private readonly GHNSettings _settings;

    public GHNService(HttpClient httpClient, IOptions<GHNSettings> settings)
    {
        _httpClient = httpClient;
        _settings = settings.Value;

        _httpClient.BaseAddress = new Uri(_settings.BaseUrl);
        _httpClient.DefaultRequestHeaders.Add("Token", _settings.Token);
    }

    public async Task<GHNCreateOrderResponseDto> CreateShippingOrderAsync(GHNCreateOrderRequestDto request)
    {
        // Add ShopId header for this request
        _httpClient.DefaultRequestHeaders.Remove("ShopId");
        _httpClient.DefaultRequestHeaders.Add("ShopId", _settings.ShopId);

        var response = await _httpClient.PostAsJsonAsync("v2/shipping-order/create", request);

        if (!response.IsSuccessStatusCode)
        {
            var errorContent = await response.Content.ReadAsStringAsync();
            throw new Exception($"GHN API Error: {response.StatusCode} - {errorContent}");
        }

        var jsonResponse = await response.Content.ReadFromJsonAsync<JsonElement>();

        if (jsonResponse.GetProperty("code").GetInt32() != 200)
        {
            throw new Exception($"GHN API Business Error: {jsonResponse.GetProperty("message").GetString()}");
        }

        var data = jsonResponse.GetProperty("data");

        return new GHNCreateOrderResponseDto
        {
            OrderCode = data.GetProperty("order_code").GetString() ?? "",
            TotalFee = data.GetProperty("total_fee").GetInt32(),
            ExpectedDeliveryTime = data.TryGetProperty("expected_delivery_time", out var expectedTime)
                ? expectedTime.GetString() ?? ""
                : ""
        };
    }

    public async Task<string> GetOrderPrintUrlAsync(string orderCode)
    {
        var request = new { order_codes = new[] { orderCode } };
        var response = await _httpClient.PostAsJsonAsync("v2/a5/gen-token", request);

        if (!response.IsSuccessStatusCode)
        {
            var errorContent = await response.Content.ReadAsStringAsync();
            throw new Exception($"GHN API Error: {response.StatusCode} - {errorContent}");
        }

        var jsonResponse = await response.Content.ReadFromJsonAsync<JsonElement>();

        if (jsonResponse.GetProperty("code").GetInt32() != 200)
        {
            throw new Exception($"GHN API Business Error: {jsonResponse.GetProperty("message").GetString()}");
        }

        var token = jsonResponse.GetProperty("data").GetProperty("token").GetString();
        
        // Return full URL to print A5
        return $"https://dev-online-gateway.ghn.vn/a5/public-api/printA5?token={token}";
        // Note: For production use: "https://online-gateway.ghn.vn/a5/public-api/printA5?token="
    }
}
