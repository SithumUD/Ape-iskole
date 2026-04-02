using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ApeIskole.Application.DTOs;
using ApeIskole.Application.Interfaces;
using ApeIskole.Domain.Entities;

namespace ApeIskole.Infrastructure.Services;

public class DonationService : IDonationService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICloudinaryService _cloudinaryService;

    public DonationService(IUnitOfWork unitOfWork, ICloudinaryService cloudinaryService)
    {
        _unitOfWork = unitOfWork;
        _cloudinaryService = cloudinaryService;
    }

    public async Task<DonationDto> CreateDonationAsync(CreateDonationRequest request, Guid userId)
    {
        var imageUrl = request.Image;
        if (request.ImageFile != null && request.ImageFile.Length > 0)
        {
            var fileDto = new FileDto
            {
                FileName = request.ImageFile.FileName,
                ContentType = request.ImageFile.ContentType,
                Content = request.ImageFile.OpenReadStream()
            };
            imageUrl = await _cloudinaryService.UploadImageAsync(fileDto, "donations") ?? request.Image;
        }

        var donation = new Donation
        {
            Title = request.Title,
            Description = request.Description,
            LongDescription = request.LongDescription,
            ImpactStatements = request.ImpactStatements,
            Category = request.Category,
            GoalAmount = request.GoalAmount,
            Image = imageUrl,
            Gallery = request.Gallery,
            ExpiryDate = request.ExpiryDate,
            SchoolId = request.SchoolId,
            AuthorId = userId,
            IsApproved = false,
            Status = request.IsDraft ? "Draft" : "Pending",
            EnableBankDetails = request.EnableBankDetails,
            BankName = request.EnableBankDetails ? request.BankName : null,
            AccountName = request.EnableBankDetails ? request.AccountName : null,
            AccountNumber = request.EnableBankDetails ? request.AccountNumber : null,
            Branch = request.EnableBankDetails ? request.Branch : null,
            SwiftCode = request.EnableBankDetails ? request.SwiftCode : null
        };

        await _unitOfWork.Donations.AddAsync(donation);
        await _unitOfWork.SaveChangesAsync();

        return MapToDto(donation);
    }

    public async Task<DonationDto> UpdateDonationAsync(Guid id, UpdateDonationRequest request, Guid userId)
    {
        var donation = await _unitOfWork.Donations.GetByIdAsync(id);
        if (donation == null || donation.IsDeleted)
            throw new Exception("Donation not found");

        if (donation.AuthorId != userId)
            throw new Exception("Unauthorized to update this donation");

        donation.Title = request.Title;
        donation.Description = request.Description;
        donation.LongDescription = request.LongDescription;
        donation.ImpactStatements = request.ImpactStatements;
        donation.Category = request.Category;
        
        if (request.IsDraft)
        {
            donation.Status = "Draft";
        }
        else if (donation.Status == "Draft" && !request.IsDraft)
        {
            donation.Status = "Pending";
            donation.IsApproved = false;
        }

        var imageUrl = request.Image ?? donation.Image;
        if (request.ImageFile != null && request.ImageFile.Length > 0)
        {
            if (!string.IsNullOrEmpty(donation.Image) && donation.Image.Contains("cloudinary"))
            {
                await _cloudinaryService.DeleteImageAsync(donation.Image);
            }
            var fileDto = new FileDto
            {
                FileName = request.ImageFile.FileName,
                ContentType = request.ImageFile.ContentType,
                Content = request.ImageFile.OpenReadStream()
            };
            imageUrl = await _cloudinaryService.UploadImageAsync(fileDto, "donations") ?? imageUrl;
        }

        donation.GoalAmount = request.GoalAmount;
        donation.Image = imageUrl;
        donation.Gallery = request.Gallery;
        donation.ExpiryDate = request.ExpiryDate;
        donation.EnableBankDetails = request.EnableBankDetails;
        donation.BankName = request.EnableBankDetails ? request.BankName : null;
        donation.AccountName = request.EnableBankDetails ? request.AccountName : null;
        donation.AccountNumber = request.EnableBankDetails ? request.AccountNumber : null;
        donation.Branch = request.EnableBankDetails ? request.Branch : null;
        donation.SwiftCode = request.EnableBankDetails ? request.SwiftCode : null;
        
        // When updated, maybe reset approval status? User didn't specify, but often safety-first is better.
        // For now, I'll keep it as is unless it's a major change.
        
        _unitOfWork.Donations.Update(donation);
        await _unitOfWork.SaveChangesAsync();

        return MapToDto(donation);
    }

    public async Task<bool> DeleteDonationAsync(Guid id, Guid userId, bool isSuperAdmin)
    {
        var donation = await _unitOfWork.Donations.GetByIdAsync(id);
        if (donation == null || donation.IsDeleted)
            return false;

        if (!isSuperAdmin && donation.AuthorId != userId)
            throw new Exception("Unauthorized to delete this donation");

        donation.IsDeleted = true;
        _unitOfWork.Donations.Update(donation);
        return await _unitOfWork.SaveChangesAsync() > 0;
    }

    public async Task<DonationDto?> GetDonationByIdAsync(Guid id)
    {
        var donation = await _unitOfWork.Donations.GetDonationWithUpdatesAsync(id);
        return donation == null ? null : MapToDto(donation);
    }

    public async Task<(IEnumerable<DonationDto> Items, int TotalCount)> GetDonationsAsync(
        string? search = null,
        string? category = null,
        decimal? minGoal = null,
        decimal? maxGoal = null,
        string? sortBy = null,
        bool? isApproved = true,
        Guid? schoolId = null,
        int pageNumber = 1,
        int pageSize = 10)
    {
        var (items, totalCount) = await _unitOfWork.Donations.GetDonationsAsync(
            search, category, minGoal, maxGoal, sortBy, isApproved, schoolId, pageNumber, pageSize);
        
        return (items.Select(MapToDto), totalCount);
    }

    public async Task<bool> ApproveDonationAsync(Guid id, bool isApproved)
    {
        var donation = await _unitOfWork.Donations.GetByIdAsync(id);
        if (donation == null) return false;

        donation.IsApproved = isApproved;
        donation.Status = isApproved ? "Active" : "Rejected";
        _unitOfWork.Donations.Update(donation);
        return await _unitOfWork.SaveChangesAsync() > 0;
    }

    public async Task<bool> ToggleFeaturedAsync(Guid id)
    {
        var donation = await _unitOfWork.Donations.GetByIdAsync(id);
        if (donation == null) return false;

        donation.IsFeatured = !donation.IsFeatured;
        _unitOfWork.Donations.Update(donation);
        return await _unitOfWork.SaveChangesAsync() > 0;
    }

    public async Task<DonationDto> AddDonationUpdateAsync(Guid donationId, AddDonationUpdateRequest request, Guid userId)
    {
        var donation = await _unitOfWork.Donations.GetByIdAsync(donationId);
        if (donation == null || donation.IsDeleted)
            throw new Exception("Donation not found");

        if (donation.AuthorId != userId)
            throw new Exception("Unauthorized to add updates to this donation");

        var update = new DonationUpdate
        {
            DonationId = donationId,
            Title = request.Title,
            Message = request.Message,
            Date = DateTime.UtcNow,
            AuthorName = donation.Author?.FullName ?? "Staff"
        };

        // We need a repository for updates or add to donation collection
        donation.DonationUpdates.Add(update);
        _unitOfWork.Donations.Update(donation);
        await _unitOfWork.SaveChangesAsync();

        return MapToDto(donation);
    }

    private DonationDto MapToDto(Donation donation)
    {
        return new DonationDto
        {
            Id = donation.Id,
            Title = donation.Title,
            Description = donation.Description,
            LongDescription = donation.LongDescription,
            ImpactStatements = donation.ImpactStatements,
            Category = donation.Category,
            GoalAmount = donation.GoalAmount,
            RaisedAmount = donation.RaisedAmount,
            DonorsCount = donation.DonorsCount,
            Image = donation.Image,
            Gallery = donation.Gallery,
            ExpiryDate = donation.ExpiryDate,
            IsFeatured = donation.IsFeatured,
            IsApproved = donation.IsApproved,
            Status = donation.Status,
            SchoolId = donation.SchoolId,
            SchoolName = donation.School?.Name ?? string.Empty,
            AuthorId = donation.AuthorId,
            AuthorName = donation.Author?.FullName ?? string.Empty,
            EnableBankDetails = donation.EnableBankDetails,
            BankName = donation.BankName,
            AccountName = donation.AccountName,
            AccountNumber = donation.AccountNumber,
            Branch = donation.Branch,
            SwiftCode = donation.SwiftCode,
            Updates = donation.DonationUpdates.Select(u => new DonationUpdateDto
            {
                Id = u.Id,
                Title = u.Title,
                Message = u.Message,
                Date = u.Date,
                AuthorName = u.AuthorName
            }).ToList()
        };
    }
}
