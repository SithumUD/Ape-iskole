using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ApeIskole.Application.DTOs;
using ApeIskole.Application.Interfaces;
using ApeIskole.Domain.Entities;
using ApeIskole.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace ApeIskole.Infrastructure.Services;

public class SchoolService : ISchoolService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICloudinaryService _cloudinaryService;
    private readonly IKeycloakAdminService _keycloakAdminService;
    private readonly IBrevoEmailService _brevoEmailService;
    private readonly IUserService _userService;
    private readonly ApplicationDbContext _db;

    public SchoolService(
        IUnitOfWork unitOfWork, 
        ICloudinaryService cloudinaryService,
        IKeycloakAdminService keycloakAdminService,
        IBrevoEmailService brevoEmailService,
        IUserService userService,
        ApplicationDbContext db)
    {
        _unitOfWork = unitOfWork;
        _cloudinaryService = cloudinaryService;
        _keycloakAdminService = keycloakAdminService;
        _brevoEmailService = brevoEmailService;
        _userService = userService;
        _db = db;
    }

    public async Task<SchoolDto> RegisterSchoolAsync(CreateSchoolRequest request)
    {
        var school = new School
        {
            Name = request.Name,
            Type = request.Type,
            Description = request.Description,
            StartedYear = request.StartedYear,
            StudentCount = request.StudentCount,
            TeachersCount = request.TeachersCount,
            Latitude = request.Latitude,
            Longitude = request.Longitude,
            Contact = MapContact(request.Contact),
            Leadership = request.Leadership.Select(l => new LeadershipMember { Name = l.Name, Position = l.Position }).ToList(),
            AcademicStreams = request.AcademicStreams,
            SchoolFacilities = request.SchoolFacilities,
            ClubsAndSocieties = request.ClubsAndSocieties,
            Achievements = request.Achievements,
            Sponsors = request.Sponsors,
            SocialMediaUrls = request.SocialMediaUrls
        };

        await _unitOfWork.Schools.AddAsync(school);
        await _unitOfWork.SaveChangesAsync();

        // Send registration received email if school has a contact email
        if (!string.IsNullOrEmpty(request.Contact?.Email))
        {
            await _brevoEmailService.SendRegistrationReceivedEmailAsync(request.Contact.Email, request.Name);
        }

        return MapToDto(school);
    }

    public async Task<(IEnumerable<SchoolDto> Items, int TotalCount)> GetSchoolsAsync(string? searchTerm, string? type, string? city, int pageNumber, int pageSize, bool? isActive = null, bool? isApproved = null)
    {
        var (items, totalCount) = await _unitOfWork.Schools.GetPagedSchoolsAsync(searchTerm, type, city, pageNumber, pageSize, isActive, isApproved);
        return (items.Select(MapToDto), totalCount);
    }

    public async Task<SchoolDto?> GetSchoolByIdAsync(Guid id)
    {
        var school = await _unitOfWork.Schools.GetSchoolWithDetailsAsync(id);
        return school != null ? MapToDto(school) : null;
    }

    public async Task<SchoolDto> UpdateSchoolAsync(Guid id, UpdateSchoolRequest request)
    {
        var school = await _unitOfWork.Schools.GetByIdAsync(id);
        if (school == null || school.IsDeleted) throw new KeyNotFoundException("School not found");

        school.Name = request.Name;
        school.Type = request.Type;
        school.Description = request.Description;
        school.StartedYear = request.StartedYear;
        school.StudentCount = request.StudentCount;
        school.TeachersCount = request.TeachersCount;
        school.Latitude = request.Latitude;
        school.Longitude = request.Longitude;
        school.Contact = MapContact(request.Contact);
        school.Leadership = request.Leadership.Select(l => new LeadershipMember { Name = l.Name, Position = l.Position }).ToList();
        school.AcademicStreams = request.AcademicStreams;
        school.SchoolFacilities = request.SchoolFacilities;
        school.ClubsAndSocieties = request.ClubsAndSocieties;
        school.Achievements = request.Achievements;
        school.Sponsors = request.Sponsors;
        school.SocialMediaUrls = request.SocialMediaUrls;

        _unitOfWork.Schools.Update(school);
        await _unitOfWork.SaveChangesAsync();

        // Send update notification email
        if (!string.IsNullOrEmpty(school.Contact?.Email))
        {
            await _brevoEmailService.SendSchoolUpdatedEmailAsync(school.Contact.Email, school.Name);
        }

        return MapToDto(school);
    }

    public async Task<bool> ToggleActiveStatusAsync(Guid id, bool isActive)
    {
        var school = await _unitOfWork.Schools.GetByIdAsync(id);
        if (school == null || school.IsDeleted) return false;

        school.IsActive = isActive;
        _unitOfWork.Schools.Update(school);
        return await _unitOfWork.SaveChangesAsync() > 0;
    }

    public async Task<bool> SoftDeleteSchoolAsync(Guid id)
    {
        var school = await _unitOfWork.Schools.GetByIdAsync(id);
        if (school == null) return false;

        school.IsDeleted = true;
        _unitOfWork.Schools.Update(school);
        var result = await _unitOfWork.SaveChangesAsync() > 0;

        if (result && !string.IsNullOrEmpty(school.Contact?.Email))
        {
            await _brevoEmailService.SendSchoolDeletedEmailAsync(school.Contact.Email, school.Name);
        }

        return result;
    }

    public async Task<bool> HardDeleteSchoolAsync(Guid id)
    {
        var school = await _unitOfWork.Schools.GetByIdAsync(id);
        if (school == null) return false;

        _unitOfWork.Schools.Remove(school);
        return await _unitOfWork.SaveChangesAsync() > 0;
    }

    public async Task<SchoolDto> UpdateImagesAsync(Guid id, FileDto? logo, FileDto? cover, List<FileDto>? gallery)
    {
        var school = await _unitOfWork.Schools.GetByIdAsync(id);
        if (school == null || school.IsDeleted) throw new KeyNotFoundException("School not found");

        if (logo != null)
        {
            school.LogoUrl = await _cloudinaryService.UploadImageAsync(logo, "logos");
        }

        if (cover != null)
        {
            school.CoverImageUrl = await _cloudinaryService.UploadImageAsync(cover, "covers");
        }

        if (gallery != null && gallery.Count > 0)
        {
            var newPhotos = await _cloudinaryService.UploadImagesAsync(gallery, "gallery");
            school.PhotoGallery.AddRange(newPhotos);
        }

        _unitOfWork.Schools.Update(school);
        await _unitOfWork.SaveChangesAsync();

        return MapToDto(school);
    }

    public async Task<bool> ApproveSchoolAsync(Guid id)
    {
        var school = await _unitOfWork.Schools.GetByIdAsync(id);
        if (school == null || school.IsDeleted) return false;

        school.IsApproved = true;
        _unitOfWork.Schools.Update(school);
        return await _unitOfWork.SaveChangesAsync() > 0;
    }

    public async Task<bool> RejectSchoolAsync(Guid id, string reason)
    {
        var school = await _unitOfWork.Schools.GetByIdAsync(id);
        if (school == null || school.IsDeleted) return false;

        school.IsApproved = false;
        // Optionally store the reason or just send it in the email
        _unitOfWork.Schools.Update(school);
        var result = await _unitOfWork.SaveChangesAsync() > 0;

        if (result && !string.IsNullOrEmpty(school.Contact?.Email))
        {
            await _brevoEmailService.SendSchoolRejectedEmailAsync(school.Contact.Email, school.Name, reason);
        }

        return result;
    }

    public async Task<UserDto> CreateSchoolUserAsync(Guid schoolId, CreateSchoolUserRequest request)
    {
        var school = await _unitOfWork.Schools.GetByIdAsync(schoolId);
        if (school == null || school.IsDeleted || !school.IsApproved)
            throw new InvalidOperationException("School not found or not approved.");

        // Generate temporary password
        var password = Guid.NewGuid().ToString("N").Substring(0, 10);

        // Create in Keycloak
        var keycloakId = await _keycloakAdminService.CreateUserAsync(request.Email, request.FullName, password, request.Role);

        // Map to SyncUserRequest and sync with DB
        var syncRequest = new SyncUserRequest
        {
            KeycloakId = keycloakId,
            FullName = request.FullName,
            Email = request.Email,
            Role = request.Role,
            SchoolId = schoolId,
            IsStudent = false
        };

        var userDto = await _userService.SyncUserAsync(syncRequest);

        // Send email with credentials
        await _brevoEmailService.SendCredentialsEmailAsync(request.Email, request.FullName, request.Email, password);

        return userDto;
    }

    public async Task<HomeDataDto> GetHomeDataAsync()
    {
        // Fetch featured schools by computing activity score = events + donations + announcements + stories
        var featuredSchools = await _db.Schools
            .Where(s => s.IsApproved && s.IsActive && !s.IsDeleted)
            .Select(s => new
            {
                School = s,
                Score = _db.Events.Count(e => e.SchoolId == s.Id && !e.IsDeleted)
                       + _db.Donations.Count(d => d.SchoolId == s.Id && !d.IsDeleted)
                       + _db.Announcements.Count(a => a.SchoolId == s.Id)
                       + _db.Stories.Count(st => st.SchoolId == s.Id && !st.IsDeleted)
            })
            .OrderByDescending(x => x.Score)
            .Take(3)
            .Select(x => x.School)
            .ToListAsync();

        // Stats - sequential to avoid DbContext concurrency issues
        var totalSchools = await _db.Schools.CountAsync(s => s.IsApproved && s.IsActive && !s.IsDeleted);
        var totalStudents = await _db.Schools.Where(s => s.IsApproved && s.IsActive && !s.IsDeleted).SumAsync(s => (long)s.StudentCount);
        var totalEvents = await _db.Events.CountAsync(e => e.IsApproved && !e.IsDeleted);
        var totalDonations = await _db.Donations.Where(d => d.IsApproved && !d.IsDeleted).SumAsync(d => d.RaisedAmount);

        var storyResult = await _unitOfWork.Stories.GetPagedStoriesAsync(null, null, null, null, true, 1, 3);
        var latestStories = storyResult.Items;
        var upcomingEvents = await _unitOfWork.Events.GetUpcomingEventsAsync(3);

        return new HomeDataDto
        {
            Stats = new HomeStatsDto
            {
                TotalSchools = totalSchools,
                TotalStudents = (int)totalStudents,
                TotalEvents = totalEvents,
                TotalDonationsRaised = totalDonations
            },
            TopStories = latestStories.Select(MapStoryToDto).ToList(),
            UpcomingEvents = upcomingEvents.Select(MapEventToDto).ToList(),
            FeaturedSchools = featuredSchools.Select(MapToDto).ToList()
        };
    }

    private static StoryDto MapStoryToDto(Story s)
    {
        return new StoryDto
        {
            Id = s.Id,
            Title = s.Title,
            Description = s.Description,
            Content = s.Content,
            Category = s.Category,
            Image = s.Image,
            Gallery = s.Gallery,
            Tags = s.Tags,
            Views = s.Views,
            Likes = s.Likes,
            IsFeatured = s.IsFeatured,
            IsPublished = s.IsPublished,
            SchoolId = s.SchoolId,
            SchoolName = s.School?.Name ?? string.Empty,
            AuthorId = s.AuthorId,
            AuthorName = s.Author?.FullName ?? string.Empty,
            CreatedAt = s.CreatedAt,
            CommentCount = s.Comments?.Count ?? 0
        };
    }

    private static EventDto MapEventToDto(Event e)
    {
        return new EventDto
        {
            Id = e.Id,
            Title = e.Title,
            Category = e.Category,
            Date = e.Date,
            Time = e.Time,
            EndDate = e.EndDate,
            EndTime = e.EndTime,
            Location = e.Location,
            Venue = e.Venue,
            ShortDescription = e.ShortDescription,
            Description = e.Description,
            Image = e.Image,
            YoutubeLink = e.YoutubeLink,
            EnableTickets = e.EnableTickets,
            EnableDonation = e.EnableDonation,
            DonationGoal = e.DonationGoal,
            DonationRaised = e.DonationRaised,
            DonationDescription = e.DonationDescription,
            IsFeatured = e.IsFeatured,
            ContactEmail = e.ContactEmail,
            ContactPhone = e.ContactPhone,
            AgeRestriction = e.AgeRestriction,
            ParkingAvailable = e.ParkingAvailable,
            FoodAvailable = e.FoodAvailable,
            WheelchairAccessible = e.WheelchairAccessible,
            IsDeleted = e.IsDeleted,
            IsApproved = e.IsApproved,
            Status = e.Status,
            SchoolId = e.SchoolId,
            SchoolName = e.School?.Name ?? string.Empty,
            TicketTypes = e.TicketTypes.Select(t => new TicketTypeDto
            {
                Id = t.Id,
                Name = t.Name,
                Type = t.Type,
                Price = t.Price,
                TotalQuantity = t.TotalQuantity,
                AvailableQuantity = t.AvailableQuantity,
                MinOrder = t.MinOrder,
                MaxOrder = t.MaxOrder,
                Description = t.Description,
                Benefits = t.Benefits
            }).ToList()
        };
    }

    private static SchoolDto MapToDto(School school)
    {
        return new SchoolDto
        {
            Id = school.Id,
            Name = school.Name,
            Type = school.Type,
            Description = school.Description,
            StartedYear = school.StartedYear,
            StudentCount = school.StudentCount,
            TeachersCount = school.TeachersCount,
            Latitude = school.Latitude,
            Longitude = school.Longitude,
            LogoUrl = school.LogoUrl,
            CoverImageUrl = school.CoverImageUrl,
            PhotoGallery = school.PhotoGallery,
            Contact = new ContactInfoDto
            {
                Phone = school.Contact.Phone,
                Email = school.Contact.Email,
                Website = school.Contact.Website,
                District = school.Contact.District,
                City = school.Contact.City,
                Address = school.Contact.Address
            },
            Leadership = school.Leadership.Select(l => new LeadershipMemberDto { Name = l.Name, Position = l.Position }).ToList(),
            AcademicStreams = school.AcademicStreams,
            SchoolFacilities = school.SchoolFacilities,
            ClubsAndSocieties = school.ClubsAndSocieties,
            Achievements = school.Achievements,
            Sponsors = school.Sponsors,
            SocialMediaUrls = school.SocialMediaUrls,
            IsVerified = school.IsVerified,
            IsApproved = school.IsApproved,
            IsActive = school.IsActive,
            IsFeatured = school.IsFeatured,
            CreatedAt = school.CreatedAt,
            UpdatedAt = school.UpdatedAt
        };
    }

    private static ContactInfo MapContact(ContactInfoDto dto)
    {
        return new ContactInfo
        {
            Phone = dto.Phone,
            Email = dto.Email,
            Website = dto.Website,
            District = dto.District,
            City = dto.City,
            Address = dto.Address
        };
    }
}
