using ApeIskole.Application.Interfaces;
using ApeIskole.Domain.Common;
using ApeIskole.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace ApeIskole.Infrastructure.Persistence;

public class DbInitializer
{
    public static async Task InitializeAsync(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        var keycloakService = scope.ServiceProvider.GetRequiredService<IKeycloakAdminService>();
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<DbInitializer>>();

        try
        {
            // 1. Run Migrations
            logger.LogInformation("Applying database migrations...");
            await context.Database.MigrateAsync();
            logger.LogInformation("Database migrations applied successfully.");

            // 2. Seed Super Admin
            await SeedSuperAdminAsync(context, keycloakService, logger);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An error occurred during database initialization.");
            throw;
        }
    }

    private static async Task SeedSuperAdminAsync(ApplicationDbContext context, IKeycloakAdminService keycloakService, ILogger logger)
    {
        const string adminEmail = "admin@apeiskole.lk";
        const string adminPassword = "Apeiskole2026";
        const string adminFullName = "Super Admin";

        var adminUser = await context.Users.FirstOrDefaultAsync(u => u.Email == adminEmail);

        if (adminUser == null)
        {
            logger.LogInformation("Seeding initial Super Admin user: {Email}", adminEmail);

            try
            {
                // Create in Keycloak
                // emailVerified = true, isTemporaryPassword = false
                string keycloakId;
                try 
                {
                    keycloakId = await keycloakService.CreateUserAsync(
                        adminEmail, 
                        adminFullName, 
                        adminPassword, 
                        UserRoles.SuperAdmin, 
                        emailVerified: true, 
                        isTemporaryPassword: false);
                    
                    logger.LogInformation("Super Admin created in Keycloak with ID: {KeycloakId}", keycloakId);
                }
                catch (Exception ex) when (ex.Message.Contains("409"))
                {
                    logger.LogWarning("User {Email} already exists in Keycloak. Attempting to sync.", adminEmail);
                    // In a real scenario, we might want to fetch the existing ID. 
                    // For now, if it failed with 409, we might need a way to get the ID if we want to proceed.
                    // But if this is a fresh setup, it shouldn't happen.
                    throw new Exception($"User {adminEmail} already exists in Keycloak but not in DB. Manual sync or cleanup required.");
                }

                // Create in Database
                var newAdmin = new User
                {
                    Email = adminEmail,
                    FullName = adminFullName,
                    KeycloakId = keycloakId,
                    Role = UserRoles.SuperAdmin,
                    IsVerified = true,
                    IsStudent = false
                };

                context.Users.Add(newAdmin);
                await context.SaveChangesAsync();
                
                logger.LogInformation("Super Admin seeded in database successfully.");
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Failed to seed Super Admin user.");
                // We don't throw here to allow the app to start, but it's a critical failure.
            }
        }
        else
        {
            logger.LogInformation("Super Admin user already exists in database.");
        }
    }
}
