using System.Threading.Tasks;

namespace ApeIskole.Application.Interfaces;

public interface IBrevoEmailService
{
    Task SendCredentialsEmailAsync(string toEmail, string fullName, string username, string password);
    Task SendRegistrationReceivedEmailAsync(string toEmail, string schoolName);
    Task SendSchoolUpdatedEmailAsync(string toEmail, string schoolName);
    Task SendSchoolDeletedEmailAsync(string toEmail, string schoolName);
    Task SendSchoolRejectedEmailAsync(string toEmail, string schoolName, string reason);
    Task SendEmailAsync(string toEmail, string subject, string htmlContent);
}
