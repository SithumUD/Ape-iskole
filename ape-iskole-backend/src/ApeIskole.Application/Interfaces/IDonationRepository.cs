using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ApeIskole.Domain.Entities;

namespace ApeIskole.Application.Interfaces;

public interface IDonationRepository : IBaseRepository<Donation>
{
    Task<(IEnumerable<Donation> Items, int TotalCount)> GetDonationsAsync(
        string? search = null,
        string? category = null,
        decimal? minGoal = null,
        decimal? maxGoal = null,
        string? sortBy = null,
        bool? isApproved = true,
        Guid? schoolId = null,
        int pageNumber = 1,
        int pageSize = 10);

    Task<Donation?> GetDonationWithUpdatesAsync(Guid id);
}
