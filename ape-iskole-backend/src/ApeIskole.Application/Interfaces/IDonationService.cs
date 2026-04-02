using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ApeIskole.Application.DTOs;

namespace ApeIskole.Application.Interfaces;

public interface IDonationService
{
    Task<DonationDto> CreateDonationAsync(CreateDonationRequest request, Guid userId);
    Task<DonationDto> UpdateDonationAsync(Guid id, UpdateDonationRequest request, Guid userId);
    Task<bool> DeleteDonationAsync(Guid id, Guid userId, bool isSuperAdmin);
    Task<DonationDto?> GetDonationByIdAsync(Guid id);
    Task<(IEnumerable<DonationDto> Items, int TotalCount)> GetDonationsAsync(
        string? search = null,
        string? category = null,
        decimal? minGoal = null,
        decimal? maxGoal = null,
        string? sortBy = null,
        bool? isApproved = true,
        Guid? schoolId = null,
        int pageNumber = 1,
        int pageSize = 10);
    
    Task<bool> ApproveDonationAsync(Guid id, bool isApproved);
    Task<bool> ToggleFeaturedAsync(Guid id);
    Task<DonationDto> AddDonationUpdateAsync(Guid donationId, AddDonationUpdateRequest request, Guid userId);
}
