using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ApeIskole.Application.DTOs;
using ApeIskole.Application.Interfaces;
using ApeIskole.Domain.Entities;

namespace ApeIskole.Infrastructure.Services;

public class EventService : IEventService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IBrevoEmailService _emailService;
    private readonly ICloudinaryService _cloudinaryService;

    public EventService(IUnitOfWork unitOfWork, IBrevoEmailService emailService, ICloudinaryService cloudinaryService)
    {
        _unitOfWork = unitOfWork;
        _emailService = emailService;
        _cloudinaryService = cloudinaryService;
    }

    public async Task<EventDto?> GetEventByIdAsync(Guid id)
    {
        var @event = await _unitOfWork.Events.GetByIdAsync(id);
        return @event == null ? null : MapToDto(@event);
    }

    public async Task<IEnumerable<EventDto>> GetAllEventsAsync()
    {
        var events = await _unitOfWork.Events.GetAllAsync();
        return events.Select(MapToDto);
    }

    public async Task<IEnumerable<EventDto>> GetApprovedEventsAsync(string? searchTerm, string? category, DateTime? startDate, DateTime? endDate, Guid? schoolId = null)
    {
        var events = await _unitOfWork.Events.SearchEventsAsync(searchTerm, category, startDate, endDate, schoolId);
        return events.Select(MapToDto);
    }

    public async Task<IEnumerable<EventDto>> GetSchoolEventsAsync(Guid schoolId)
    {
        var events = await _unitOfWork.Events.GetBySchoolIdAsync(schoolId);
        return events.Select(MapToDto);
    }

    public async Task<IEnumerable<EventDto>> GetUpcomingEventsAsync(int count)
    {
        var events = await _unitOfWork.Events.GetUpcomingEventsAsync(count);
        return events.Select(MapToDto);
    }

    public async Task<IEnumerable<EventDto>> GetPendingEventsAsync()
    {
        var events = await _unitOfWork.Events.GetPendingEventsAsync();
        return events.Select(MapToDto);
    }

    public async Task<EventDto> CreateEventAsync(CreateEventRequest request, Guid userId)
    {
        // Upload image to Cloudinary if file is provided
        var imageUrl = request.Image;
        if (request.ImageFile != null && request.ImageFile.Length > 0)
        {
            var fileDto = new FileDto
            {
                FileName = request.ImageFile.FileName,
                ContentType = request.ImageFile.ContentType,
                Content = request.ImageFile.OpenReadStream()
            };
            imageUrl = await _cloudinaryService.UploadImageAsync(fileDto, "events") ?? request.Image;
        }

        var @event = new Event
        {
            Title = request.Title,
            Category = request.Category,
            Date = request.Date,
            Time = request.Time,
            EndDate = request.EndDate,
            EndTime = request.EndTime,
            Location = request.Location,
            Venue = request.Venue,
            ShortDescription = request.ShortDescription,
            Description = request.Description,
            Image = imageUrl,
            YoutubeLink = request.YoutubeLink ?? string.Empty,
            IsFree = request.IsFree,
            ParticipationDetails = request.ParticipationDetails,
            EnableTickets = request.EnableTickets,
            EnableDonation = request.EnableDonation,
            DonationGoal = request.DonationGoal,
            DonationDescription = request.DonationDescription ?? string.Empty,
            IsFeatured = request.IsFeatured,
            ContactEmail = request.ContactEmail,
            ContactPhone = request.ContactPhone,
            AgeRestriction = request.AgeRestriction ?? string.Empty,
            ParkingAvailable = request.ParkingAvailable,
            FoodAvailable = request.FoodAvailable,
            WheelchairAccessible = request.WheelchairAccessible,
            SchoolId = request.SchoolId,
            AuthorId = userId,
            IsApproved = false,
            Status = "Pending"
        };

        foreach (var t in request.TicketTypes)
        {
            @event.TicketTypes.Add(new TicketType
            {
                Name = t.Name,
                Type = t.Type,
                Price = t.Price,
                TotalQuantity = t.TotalQuantity,
                AvailableQuantity = t.TotalQuantity,
                MinOrder = t.MinOrder,
                MaxOrder = t.MaxOrder,
                Description = t.Description,
                Benefits = t.Benefits
            });
        }

        await _unitOfWork.Events.AddAsync(@event);
        await _unitOfWork.SaveChangesAsync();

        return MapToDto(@event);
    }

    public async Task<bool> UpdateEventAsync(Guid id, CreateEventRequest request, Guid userId)
    {
        var @event = await _unitOfWork.Events.GetByIdAsync(id);
        if (@event == null) return false;

        // Upload new image to Cloudinary if a new file is provided
        var imageUrl = request.Image ?? @event.Image; // fallback to existing image
        if (request.ImageFile != null && request.ImageFile.Length > 0)
        {
            // Delete old Cloudinary image if it exists
            if (!string.IsNullOrEmpty(@event.Image) && @event.Image.Contains("cloudinary"))
            {
                await _cloudinaryService.DeleteImageAsync(@event.Image);
            }

            var fileDto = new FileDto
            {
                FileName = request.ImageFile.FileName,
                ContentType = request.ImageFile.ContentType,
                Content = request.ImageFile.OpenReadStream()
            };
            imageUrl = await _cloudinaryService.UploadImageAsync(fileDto, "events") ?? imageUrl;
        }
        @event.Title = request.Title;
        @event.Category = request.Category;
        @event.Date = request.Date;
        @event.Time = request.Time;
        @event.EndDate = request.EndDate;
        @event.EndTime = request.EndTime;
        @event.Location = request.Location;
        @event.Venue = request.Venue;
        @event.ShortDescription = request.ShortDescription;
        @event.Description = request.Description;
        @event.Image = imageUrl;
        @event.YoutubeLink = request.YoutubeLink ?? string.Empty;
        @event.IsFree = request.IsFree;
        @event.ParticipationDetails = request.ParticipationDetails;
        @event.EnableTickets = request.EnableTickets;
        @event.EnableDonation = request.EnableDonation;
        @event.DonationGoal = request.DonationGoal;
        @event.DonationDescription = request.DonationDescription ?? string.Empty;
        @event.IsFeatured = request.IsFeatured;
        @event.ContactEmail = request.ContactEmail;
        @event.ContactPhone = request.ContactPhone;
        @event.AgeRestriction = request.AgeRestriction ?? string.Empty;
        @event.ParkingAvailable = request.ParkingAvailable;
        @event.FoodAvailable = request.FoodAvailable;
        @event.WheelchairAccessible = request.WheelchairAccessible;
        
        // When updated, it might need re-approval?
        @event.IsApproved = false;
        @event.Status = "Pending";

        _unitOfWork.Events.Update(@event);
        await _unitOfWork.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteEventAsync(Guid id, Guid userId)
    {
        var @event = await _unitOfWork.Events.GetByIdAsync(id);
        if (@event == null) return false;

        _unitOfWork.Events.Delete(@event);
        await _unitOfWork.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ApproveEventAsync(Guid id, bool isApproved)
    {
        var @event = await _unitOfWork.Events.GetByIdAsync(id);
        if (@event == null) return false;

        @event.IsApproved = isApproved;
        @event.Status = isApproved ? "Approved" : "Rejected";

        _unitOfWork.Events.Update(@event);
        await _unitOfWork.SaveChangesAsync();
        return true;
    }

    public async Task<bool> IncrementViewCountAsync(Guid id)
    {
        var @event = await _unitOfWork.Events.GetByIdAsync(id);
        if (@event == null) return false;

        @event.ViewCount++;
        _unitOfWork.Events.Update(@event);
        await _unitOfWork.SaveChangesAsync();
        return true;
    }

    public async Task<TicketPurchaseDto> PurchaseTicketAsync(PurchaseTicketRequest request, Guid? userId)
    {
        var purchase = new TicketPurchase
        {
            TicketTypeId = request.TicketTypeId,
            UserId = userId,
            Quantity = request.Quantity,
            CustomerName = request.CustomerName,
            CustomerEmail = request.CustomerEmail,
            CustomerPhone = request.CustomerPhone,
            NIC = request.NIC,
            SpecialRequests = request.SpecialRequests,
            ReceiptUrl = request.ReceiptUrl,
            Status = "Pending"
        };

        await _unitOfWork.TicketPurchases.AddAsync(purchase);
        await _unitOfWork.SaveChangesAsync();

        // Re-fetch to get included data for DTO
        var savedPurchase = await _unitOfWork.TicketPurchases.GetByIdAsync(purchase.Id);
        return MapToDto(savedPurchase!);
    }

    public async Task<bool> VerifyTicketPaymentAsync(Guid purchaseId, bool isApproved, Guid verifierId)
    {
        var purchase = await _unitOfWork.TicketPurchases.GetByIdAsync(purchaseId);
        if (purchase == null) return false;

        purchase.IsPaymentApproved = isApproved;
        purchase.Status = isApproved ? "Approved" : "Rejected";
        purchase.VerificationDate = DateTime.UtcNow;
        purchase.VerifiedBy = verifierId;

        if (isApproved)
        {
            // Reduce ticket quantity
            purchase.TicketType.AvailableQuantity -= purchase.Quantity;
            
            // Send email
            await _emailService.SendEmailAsync(
                purchase.CustomerEmail,
                "Ticket Purchase Confirmed",
                $"Hello {purchase.CustomerName}, your ticket for {purchase.TicketType.Event.Title} has been confirmed. Type: {purchase.TicketType.Name}, Quantity: {purchase.Quantity}."
            );
        }

        _unitOfWork.TicketPurchases.Update(purchase);
        await _unitOfWork.SaveChangesAsync();
        return true;
    }

    public async Task<IEnumerable<TicketPurchaseDto>> GetPendingVerificationsAsync(Guid schoolId)
    {
        var purchases = await _unitOfWork.TicketPurchases.GetPendingVerificationsBySchoolIdAsync(schoolId);
        return purchases.Select(MapToDto);
    }

    private EventDto MapToDto(Event e)
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
            IsFree = e.IsFree,
            ParticipationDetails = e.ParticipationDetails,
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
            ViewCount = e.ViewCount,
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

    private TicketPurchaseDto MapToDto(TicketPurchase p)
    {
        return new TicketPurchaseDto
        {
            Id = p.Id,
            TicketTypeId = p.TicketTypeId,
            TicketTypeName = p.TicketType?.Name ?? string.Empty,
            EventTitle = p.TicketType?.Event?.Title ?? string.Empty,
            Quantity = p.Quantity,
            TotalPrice = p.TotalPrice,
            CustomerName = p.CustomerName,
            CustomerEmail = p.CustomerEmail,
            Status = p.Status,
            ReceiptUrl = p.ReceiptUrl,
            IsPaymentApproved = p.IsPaymentApproved
        };
    }
}
