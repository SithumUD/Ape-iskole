using ApeIskole.Application.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace ApeIskole.Infrastructure.Services;

public class KeycloakAdminService : IKeycloakAdminService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;
    private readonly ILogger<KeycloakAdminService> _logger;

    public KeycloakAdminService(HttpClient httpClient, IConfiguration configuration, ILogger<KeycloakAdminService> logger)
    {
        _httpClient = httpClient;
        _configuration = configuration;
        _logger = logger;
    }

    public async Task<string> CreateUserAsync(string email, string fullName, string password, string role, bool emailVerified = false, bool isTemporaryPassword = true)
    {
        var token = await GetAdminTokenAsync();
        _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var serverUrl = _configuration["Keycloak:ServerUrl"];
        var realm = _configuration["Keycloak:Realm"];
        
        var user = new
        {
            username = email,
            email = email,
            enabled = true,
            emailVerified = emailVerified,
            firstName = fullName,
            credentials = new[]
            {
                new { type = "password", value = password, temporary = isTemporaryPassword }
            },
            requiredActions = emailVerified ? Array.Empty<string>() : new[] { "VERIFY_EMAIL", "UPDATE_PASSWORD" }
        };

        var response = await _httpClient.PostAsync($"{serverUrl}/admin/realms/{realm}/users", 
            new StringContent(JsonSerializer.Serialize(user), Encoding.UTF8, "application/json"));

        if (!response.IsSuccessStatusCode)
        {
            var error = await response.Content.ReadAsStringAsync();
            _logger.LogError("Failed to create user in Keycloak: {Error}", error);
            throw new Exception($"Failed to create user in Keycloak: {error}");
        }

        // Get the created user ID from Location header
        var location = response.Headers.Location;
        var keycloakId = location?.Segments.Last();

        if (string.IsNullOrEmpty(keycloakId))
        {
            throw new Exception("Could not retrieve Keycloak ID from response.");
        }

        // ✅ ASSIGN ROLE IN KEYCLOAK
        if (!string.IsNullOrEmpty(role))
        {
            try 
            {
                // 1. Get realm role representation
                var roleResponse = await _httpClient.GetAsync($"{serverUrl}/admin/realms/{realm}/roles/{role}");
                if (roleResponse.IsSuccessStatusCode)
                {
                    var roleJson = await roleResponse.Content.ReadAsStringAsync();
                    var roleData = JsonSerializer.Deserialize<JsonElement>(roleJson);
                    
                    // 2. Assign the role
                    var roleMapping = new[] { new { id = roleData.GetProperty("id").GetString(), name = role } };
                    var assignResponse = await _httpClient.PostAsync(
                        $"{serverUrl}/admin/realms/{realm}/users/{keycloakId}/role-mappings/realm",
                        new StringContent(JsonSerializer.Serialize(roleMapping), Encoding.UTF8, "application/json"));

                    if (!assignResponse.IsSuccessStatusCode)
                    {
                        var assignError = await assignResponse.Content.ReadAsStringAsync();
                        _logger.LogError("Failed to assign role {Role} to user {UserId}: {Error}", role, keycloakId, assignError);
                    }
                    else 
                    {
                        _logger.LogInformation("Successfully assigned role {Role} to user {UserId}", role, keycloakId);
                    }
                }
                else 
                {
                    _logger.LogWarning("Role {Role} not found in Keycloak. Skipping role assignment.", role);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during Keycloak role assignment for user {Email}", email);
            }
        }

        return keycloakId;
    }

    private async Task<string> GetAdminTokenAsync()
    {
        var serverUrl = _configuration["Keycloak:ServerUrl"];
        var realm = _configuration["Keycloak:Realm"];
        var clientId = _configuration["Keycloak:AdminClientId"];
        var clientSecret = _configuration["Keycloak:AdminClientSecret"];

        var content = new FormUrlEncodedContent(new[]
        {
            new KeyValuePair<string, string>("grant_type", "client_credentials"),
            new KeyValuePair<string, string>("client_id", clientId!),
            new KeyValuePair<string, string>("client_secret", clientSecret!)
        });

        var response = await _httpClient.PostAsync($"{serverUrl}/realms/{realm}/protocol/openid-connect/token", content);
        
        if (!response.IsSuccessStatusCode)
        {
            var error = await response.Content.ReadAsStringAsync();
            _logger.LogError("Failed to get Keycloak admin token: {Error}", error);
            throw new Exception("Failed to authenticate with Keycloak Admin API.");
        }

        var json = await response.Content.ReadAsStringAsync();
        var result = JsonSerializer.Deserialize<JsonElement>(json);
        return result.GetProperty("access_token").GetString() ?? string.Empty;
    }
}
