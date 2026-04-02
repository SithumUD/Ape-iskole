using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ApeIskole.Domain.Entities;

namespace ApeIskole.Application.Interfaces;

public interface ISchoolRepository : IBaseRepository<School>
{
    Task<School?> GetSchoolWithDetailsAsync(Guid id);
    Task<(IEnumerable<School> Items, int TotalCount)> GetPagedSchoolsAsync(string? searchTerm, string? type, string? city, int pageNumber, int pageSize, bool? isActive = null, bool? isApproved = null);
}
