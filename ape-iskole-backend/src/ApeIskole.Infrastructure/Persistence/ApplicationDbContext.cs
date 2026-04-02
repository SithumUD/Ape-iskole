using System;
using System.Threading;
using System.Threading.Tasks;
using ApeIskole.Domain.Entities;
using ApeIskole.Domain.Common;
using Microsoft.EntityFrameworkCore;

namespace ApeIskole.Infrastructure.Persistence;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<School> Schools => Set<School>();
    public DbSet<User> Users => Set<User>();
    public DbSet<Announcement> Announcements => Set<Announcement>();
    public DbSet<Story> Stories => Set<Story>();
    public DbSet<Comment> Comments => Set<Comment>();
    public DbSet<Donation> Donations => Set<Donation>();
    public DbSet<DonationUpdate> DonationUpdates => Set<DonationUpdate>();
    public DbSet<Promotion> Promotions => Set<Promotion>();
    public DbSet<Event> Events => Set<Event>();
    public DbSet<TicketType> TicketTypes => Set<TicketType>();
    public DbSet<TicketPurchase> TicketPurchases => Set<TicketPurchase>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        modelBuilder.Entity<User>()
            .HasIndex(u => u.KeycloakId)
            .IsUnique();

        // Configure relationships and constraints here
        modelBuilder.Entity<School>()
            .HasMany(s => s.Administrators)
            .WithOne(u => u.School)
            .HasForeignKey(u => u.SchoolId);

        modelBuilder.Entity<School>()
            .HasMany(s => s.Announcements)
            .WithOne(a => a.School)
            .HasForeignKey(a => a.SchoolId);

        modelBuilder.Entity<School>()
            .HasMany(s => s.Events)
            .WithOne(e => e.School)
            .HasForeignKey(e => e.SchoolId);
            
        modelBuilder.Entity<Announcement>(entity =>
        {
            entity.HasOne(a => a.CreatedBy)
                .WithMany()
                .HasForeignKey(a => a.CreatedById);
        });

        // Story Configuration
        modelBuilder.Entity<Story>(entity =>
        {
            entity.HasOne(s => s.School)
                .WithMany()
                .HasForeignKey(s => s.SchoolId);

            entity.HasOne(s => s.Author)
                .WithMany()
                .HasForeignKey(s => s.AuthorId);

            entity.Property(e => e.Gallery).HasColumnType("jsonb");
            entity.Property(e => e.Tags).HasColumnType("jsonb");
        });

        // Comment Configuration
        modelBuilder.Entity<Comment>()
            .HasOne(c => c.Story)
            .WithMany(s => s.Comments)
            .HasForeignKey(c => c.StoryId);

        // Configure School complex fields as JSON
        modelBuilder.Entity<School>(entity =>
        {
            entity.Property(e => e.Contact).HasColumnType("jsonb");
            entity.Property(e => e.Leadership).HasColumnType("jsonb");
            entity.Property(e => e.AcademicStreams).HasColumnType("jsonb");
            entity.Property(e => e.SchoolFacilities).HasColumnType("jsonb");
            entity.Property(e => e.ClubsAndSocieties).HasColumnType("jsonb");
            entity.Property(e => e.Achievements).HasColumnType("jsonb");
            entity.Property(e => e.Sponsors).HasColumnType("jsonb");
            entity.Property(e => e.SocialMediaUrls).HasColumnType("jsonb");
            entity.Property(e => e.PhotoGallery).HasColumnType("jsonb");
        });

        // Ticket Configuration
        modelBuilder.Entity<TicketType>()
            .Property(t => t.Benefits)
            .HasColumnType("jsonb");

        modelBuilder.Entity<Event>()
            .HasMany(e => e.TicketTypes)
            .WithOne(t => t.Event)
            .HasForeignKey(t => t.EventId);

        modelBuilder.Entity<TicketType>()
            .HasMany(t => t.Purchases)
            .WithOne(p => p.TicketType)
            .HasForeignKey(p => p.TicketTypeId);

        modelBuilder.Entity<TicketPurchase>()
            .HasOne(p => p.Verifier)
            .WithMany()
            .HasForeignKey(p => p.VerifiedBy);
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        foreach (var entry in ChangeTracker.Entries<BaseEntity>())
        {
            switch (entry.State)
            {
                case EntityState.Added:
                    entry.Entity.CreatedAt = DateTime.UtcNow;
                    break;
                case EntityState.Modified:
                    entry.Entity.UpdatedAt = DateTime.UtcNow;
                    break;
            }
        }

        return base.SaveChangesAsync(cancellationToken);
    }
}
