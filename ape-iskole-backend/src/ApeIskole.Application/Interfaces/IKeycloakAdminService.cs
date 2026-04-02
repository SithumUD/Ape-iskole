using System.Threading.Tasks;

namespace ApeIskole.Application.Interfaces;

public interface IKeycloakAdminService
{
    Task<string> CreateUserAsync(string email, string fullName, string password, string role, bool emailVerified = false, bool isTemporaryPassword = true);
}
