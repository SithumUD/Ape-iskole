using ApeIskole.Application.Interfaces;
using ApeIskole.Infrastructure.Persistence;
using ApeIskole.Infrastructure.Repositories;
using ApeIskole.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Npgsql;

namespace ApeIskole.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
    {
        // Register DbContext with PostgreSQL and Dynamic JSON support
        var connectionString = configuration.GetConnectionString("DefaultConnection");
        
        var dataSourceBuilder = new NpgsqlDataSourceBuilder(connectionString);
        dataSourceBuilder.EnableDynamicJson();
        var dataSource = dataSourceBuilder.Build();

        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseNpgsql(dataSource));

        // Register Repositories
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<ISchoolRepository, SchoolRepository>();
        services.AddScoped<IStoryRepository, StoryRepository>();
        services.AddScoped<ICommentRepository, CommentRepository>();
        services.AddScoped<IDonationRepository, DonationRepository>();
        services.AddScoped<IPromotionRepository, PromotionRepository>();
        services.AddScoped<IEventRepository, EventRepository>();
        services.AddScoped<ITicketPurchaseRepository, TicketPurchaseRepository>();
        services.AddScoped<IAnnouncementRepository, AnnouncementRepository>();
        services.AddScoped<IUnitOfWork, UnitOfWork>();

        // Register Services
        services.AddHttpClient();
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<ISchoolService, SchoolService>();
        services.AddScoped<ICloudinaryService, CloudinaryService>();
        services.AddScoped<IBrevoEmailService, BrevoEmailService>();
        services.AddScoped<IKeycloakAdminService, KeycloakAdminService>();
        services.AddScoped<IStoryService, StoryService>();
        services.AddScoped<ICommentService, CommentService>();
        services.AddScoped<IDonationService, DonationService>();
        services.AddScoped<IPromotionService, PromotionService>();
        services.AddScoped<IEventService, EventService>();
        services.AddScoped<IAnnouncementService, AnnouncementService>();

        return services;
    }
}
