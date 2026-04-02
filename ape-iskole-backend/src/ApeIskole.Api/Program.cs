using ApeIskole.Application;
using ApeIskole.Infrastructure;
using ApeIskole.Domain.Common;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers()
    .AddJsonOptions(options => {
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
    });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Register Clean Architecture Layers
builder.Services.AddApplicationServices();
builder.Services.AddInfrastructureServices(builder.Configuration);


// ✅ KEYCLOAK JWT CONFIG (FIXED)
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.Authority = builder.Configuration["Keycloak:Authority"] ?? "http://localhost:8080/realms/apeiskole";
    options.RequireHttpsMetadata = false;

    // 🚀 FORCE OLD JWT HANDLER (Fixes IDX14100 dots error in .NET 8)
    options.TokenHandlers.Clear();
    options.TokenHandlers.Add(new System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler());

    options.TokenValidationParameters = new TokenValidationParameters
    {
        // ✅ Validate issuer (must match Keycloak realm)
        ValidateIssuer = true,
        ValidIssuer = builder.Configuration["Keycloak:Authority"] ?? "http://localhost:8080/realms/apeiskole",

        // ✅ Audience (disable for now, enable later if needed)
        ValidateAudience = false,

        // ✅ Token lifetime
        ValidateLifetime = true,

        // ✅ Signature validation (IMPORTANT)
        ValidateIssuerSigningKey = true,

        // ✅ Fix role mapping from Keycloak
        RoleClaimType = ClaimTypes.Role,
        NameClaimType = "preferred_username"
    };

    // ✅ CUSTOM ROLE MAPPING FROM KEYCLOAK TOKEN
    options.Events = new JwtBearerEvents
    {
        OnTokenValidated = async context =>
        {
            var identity = context.Principal?.Identity as ClaimsIdentity;

            if (identity != null)
            {
                // 1. Extract roles from Keycloak "realm_access"
                var realmAccessSplit = context.Principal?.FindFirst("realm_access")?.Value;
                if (!string.IsNullOrEmpty(realmAccessSplit))
                {
                    try 
                    {
                        var roles = System.Text.Json.JsonDocument.Parse(realmAccessSplit)
                            .RootElement
                            .GetProperty("roles");

                        foreach (var role in roles.EnumerateArray())
                        {
                            var roleName = role.GetString();
                            if (!string.IsNullOrEmpty(roleName))
                            {
                                identity.AddClaim(new Claim(ClaimTypes.Role, roleName));
                            }
                        }
                    }
                    catch (Exception ex) 
                    {
                        Console.WriteLine($"⚠️ Error parsing realm_access: {ex.Message}");
                    }
                }

                // 2. Extract roles from root "role" claim
                var rolesList = context.Principal?.FindAll("role");
                if (rolesList != null)
                {
                    foreach (var claim in rolesList)
                    {
                        if (!string.IsNullOrEmpty(claim.Value))
                        {
                            identity.AddClaim(new Claim(ClaimTypes.Role, claim.Value));
                        }
                    }
                }

                // 🚀 3. SYNC WITH DATABASE ROLE (Source of Truth for Backend)
                try
                {
                    var keycloakId = context.Principal?.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                                   ?? context.Principal?.FindFirst("sub")?.Value;

                    if (!string.IsNullOrEmpty(keycloakId))
                    {
                        using var scope = context.HttpContext.RequestServices.CreateScope();
                        var unitOfWork = scope.ServiceProvider.GetRequiredService<ApeIskole.Application.Interfaces.IUnitOfWork>();
                        var user = await unitOfWork.Users.GetByKeycloakIdAsync(keycloakId);

                        if (user != null && !string.IsNullOrEmpty(user.Role))
                        {
                            // Remove existing identity role claims to avoid duplicates/conflicts
                            var existingRoles = identity.FindAll(ClaimTypes.Role).ToList();
                            foreach (var claim in existingRoles)
                            {
                                identity.RemoveClaim(claim);
                            }
                            // Inject the role from the Database
                            identity.AddClaim(new Claim(ClaimTypes.Role, user.Role));
                            Console.WriteLine($"✅ Backend Role synced from DB: {user.Role} for user {user.Email}");
                        }
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"⚠️ Database role sync failed during auth: {ex.Message}");
                }
            }

        },

        OnAuthenticationFailed = context =>
        {
            Console.WriteLine("❌ Authentication failed: " + context.Exception.Message);
            return Task.CompletedTask;
        },

        OnChallenge = context =>
        {
            Console.WriteLine($"⚠️ OnChallenge: {context.Error}, {context.ErrorDescription}");
            return Task.CompletedTask;
        }
    };
});


// ✅ AUTHORIZATION POLICIES
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy(UserRoles.SuperAdmin, policy =>
        policy.RequireRole(UserRoles.SuperAdmin));

    options.AddPolicy(UserRoles.SchoolAdmin, policy =>
        policy.RequireRole(UserRoles.SchoolAdmin));

    options.AddPolicy(UserRoles.Moderator, policy =>
        policy.RequireRole(UserRoles.Moderator));

    options.AddPolicy(UserRoles.PublicUser, policy =>
        policy.RequireRole(UserRoles.PublicUser));
});


// ✅ CORS (for React frontend)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            var origins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() 
                         ?? new[] { "http://localhost:5173" };
            policy.WithOrigins(origins)
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});


builder.Services.AddHealthChecks();
var app = builder.Build();

// ✅ Database Initialization (Migrations + Seeding)
try
{
    Console.WriteLine("🚀 Starting Database Initialization...");
    await ApeIskole.Infrastructure.Persistence.DbInitializer.InitializeAsync(app.Services);
    Console.WriteLine("✅ Database Initialization Complete.");
}
catch (Exception ex)
{
    Console.WriteLine($"❌ CRITICAL: Database Initialization Failed: {ex.Message}");
    // Optionally: throw or handle based on environment
}



// ✅ Middleware Pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowFrontend");

app.MapHealthChecks("/health");

// 🔍 DEBUG MIDDLEWARE: Print raw header to console
app.Use(async (context, next) =>
{
    var authHeader = context.Request.Headers["Authorization"].ToString();
    if (!string.IsNullOrEmpty(authHeader))
    {
        // 🛠️ SANITIZATION: Remove any accidentally copied spaces or newlines
        var cleanHeader = authHeader.Trim().Replace(" ", " ").Trim();
        context.Request.Headers["Authorization"] = cleanHeader;

        Console.WriteLine($"--- DEBUG RAW HEADER ---");
        Console.WriteLine($"Orig Length: {authHeader.Length} | Clean Length: {cleanHeader.Length}");
        Console.WriteLine($"Dot count: {cleanHeader.Count(c => c == '.')}");
        
        // Try manual parse
        try 
        {
            var handler = new System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler();
            var tokenOnly = cleanHeader.StartsWith("Bearer ") ? cleanHeader.Substring(7) : cleanHeader;
            if (handler.CanReadToken(tokenOnly))
            {
                var jwt = handler.ReadJwtToken(tokenOnly);
                Console.WriteLine($"✅ MANUAL PARSE SUCCESS. Issuer: {jwt.Issuer}");
            }
            else
            {
                Console.WriteLine("❌ MANUAL PARSE: CanReadToken returned false");
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ MANUAL PARSE ERROR: {ex.Message}");
        }

        // 🔍 DEBUG: Log request body for Sync endpoint
        if (context.Request.Path.Value?.Contains("/User/sync") == true && context.Request.Method == "POST")
        {
            context.Request.EnableBuffering();
            using (var reader = new StreamReader(context.Request.Body, System.Text.Encoding.UTF8, true, 1024, true))
            {
                var body = await reader.ReadToEndAsync();
                context.Request.Body.Position = 0;
                Console.WriteLine($"--- DEBUG SYNC BODY ---");
                Console.WriteLine(body);
                Console.WriteLine($"-----------------------");
            }
        }

        if (cleanHeader.Contains("\"")) Console.WriteLine("⚠️ WARNING: Header contains double quotes!");
        Console.WriteLine($"-------------------------");
    }
    await next();
});

// 🔥 IMPORTANT ORDER
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();