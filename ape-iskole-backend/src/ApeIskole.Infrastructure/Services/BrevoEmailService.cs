using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using ApeIskole.Application.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace ApeIskole.Infrastructure.Services;

public class BrevoEmailService : IBrevoEmailService
{
    private readonly HttpClient _httpClient;
    private readonly string _apiKey;
    private readonly string _senderEmail;
    private readonly string _senderName;
    private readonly ILogger<BrevoEmailService> _logger;

    public BrevoEmailService(HttpClient httpClient, IConfiguration configuration, ILogger<BrevoEmailService> logger)
    {
        _httpClient = httpClient;
        _apiKey = configuration["Brevo:ApiKey"] ?? string.Empty;
        _senderEmail = configuration["Brevo:SenderEmail"] ?? "no-reply@apeiskole.com";
        _senderName = configuration["Brevo:SenderName"] ?? "Ape Iskole";
        _logger = logger;
    }

    public async Task SendCredentialsEmailAsync(string toEmail, string fullName, string username, string password)
    {
        var htmlContent = $@"
                <div style='font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;'>
                    <h2 style='color: #2563eb;'>Welcome to Ape Iskole, {fullName}!</h2>
                    <p>Your school has been approved, and your administrator account has been created.</p>
                    <div style='background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;'>
                        <p><strong>Username:</strong> {username}</p>
                        <p><strong>Temporary Password:</strong> {password}</p>
                    </div>
                    <p style='color: #ef4444; font-weight: bold;'>⚠️ Important Security Steps:</p>
                    <ul>
                        <li>Verify your email: Check your inbox for a verification link sent by Keycloak.</li>
                        <li>Change Password: You will be required to change your temporary password upon first login.</li>
                    </ul>
                    <p>Please log in at <a href='https://apeiskole.lk/login'>https://apeiskole.lk/login</a> after verifying your email.</p>
                    <br/>
                    <p>Best Regards,<br/><strong>Team Ape Iskole</strong></p>
                </div>";
        
        await SendEmailAsync(toEmail, "Your School Admin Account - Ape Iskole", htmlContent);
    }

    public async Task SendRegistrationReceivedEmailAsync(string toEmail, string schoolName)
    {
        var htmlContent = $@"
                <div style='font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;'>
                    <h2 style='color: #10b981;'>Registration Received!</h2>
                    <p>Dear Administrator,</p>
                    <p>We have successfully received the registration request for <strong>{schoolName}</strong>.</p>
                    <p>Our team is currently reviewing your verification documents. This process typically takes <strong>24-48 hours</strong>.</p>
                    <p>Once approved, you will receive an email with your login credentials and further instructions.</p>
                    <br/>
                    <p>Thank you for joining the Ape Iskole community!</p>
                    <br/>
                    <p>Best Regards,<br/><strong>Team Ape Iskole</strong></p>
                </div>";

        await SendEmailAsync(toEmail, $"Registration Received: {schoolName} - Ape Iskole", htmlContent);
    }

    public async Task SendSchoolUpdatedEmailAsync(string toEmail, string schoolName)
    {
        var htmlContent = $@"
                <div style='font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;'>
                    <h2 style='color: #2563eb;'>School Profile Updated</h2>
                    <p>Dear Administrator,</p>
                    <p>The profile for <strong>{schoolName}</strong> has been updated by the Super Admin.</p>
                    <p>Please log in to your dashboard to review the changes.</p>
                    <br/>
                    <p>Best Regards,<br/><strong>Team Ape Iskole</strong></p>
                </div>";

        await SendEmailAsync(toEmail, $"School Profile Updated: {schoolName} - Ape Iskole", htmlContent);
    }

    public async Task SendSchoolDeletedEmailAsync(string toEmail, string schoolName)
    {
        var htmlContent = $@"
                <div style='font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;'>
                    <h2 style='color: #ef4444;'>School Account Deactivated</h2>
                    <p>Dear Administrator,</p>
                    <p>The account for <strong>{schoolName}</strong> has been deactivated by the Super Admin.</p>
                    <p>If you believe this is a mistake, please contact our support team.</p>
                    <br/>
                    <p>Best Regards,<br/><strong>Team Ape Iskole</strong></p>
                </div>";

        await SendEmailAsync(toEmail, $"School Account Deactivated: {schoolName} - Ape Iskole", htmlContent);
    }

    public async Task SendSchoolRejectedEmailAsync(string toEmail, string schoolName, string reason)
    {
        var htmlContent = $@"
                <div style='font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;'>
                    <h2 style='color: #ef4444;'>Registration Rejected</h2>
                    <p>Dear Administrator,</p>
                    <p>We regret to inform you that your registration request for <strong>{schoolName}</strong> has been rejected.</p>
                    <div style='background-color: #fee2e2; padding: 15px; border-radius: 8px; margin: 20px 0;'>
                        <p><strong>Reason for rejection:</strong></p>
                        <p>{reason}</p>
                    </div>
                    <p>You may resubmit your application after addressing the above issues.</p>
                    <br/>
                    <p>Best Regards,<br/><strong>Team Ape Iskole</strong></p>
                </div>";

        await SendEmailAsync(toEmail, $"Registration Rejected: {schoolName} - Ape Iskole", htmlContent);
    }

    public async Task SendEmailAsync(string toEmail, string subject, string htmlContent)
    {
        var emailData = new
        {
            sender = new { name = _senderName, email = _senderEmail },
            to = new[] { new { email = toEmail } },
            subject = subject,
            htmlContent = htmlContent
        };

        var request = new HttpRequestMessage(HttpMethod.Post, "https://api.brevo.com/v3/smtp/email");
        request.Headers.Add("api-key", _apiKey);
        request.Content = new StringContent(JsonSerializer.Serialize(emailData), Encoding.UTF8, "application/json");

        // 🛡️ MASKED LOGGING FOR DIAGNOSTICS
        var maskedKey = string.IsNullOrEmpty(_apiKey) ? "MISSING" : _apiKey.Substring(0, 8) + "..." + _apiKey.Substring(Math.Max(0, _apiKey.Length - 4));
        _logger.LogInformation("📧 Attempting Brevo Send... Sender: {Sender}, To: {Recipient}, Key: {Key}", _senderEmail, toEmail, maskedKey);

        var response = await _httpClient.SendAsync(request);
        if (!response.IsSuccessStatusCode)
        {
            var errorBody = await response.Content.ReadAsStringAsync();
            _logger.LogError("❌ Brevo Failure. Status: {StatusCode}, Error: {Error}", response.StatusCode, errorBody);
            throw new Exception($"Brevo API Error: {errorBody}");
        }

        _logger.LogInformation("✅ Email sent successfully to {Recipient}", toEmail);
    }
}
