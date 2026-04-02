using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ApeIskole.Domain.Entities;

namespace ApeIskole.Application.Interfaces;

public interface IUserRepository : IBaseRepository<User>
{
    Task<User?> GetByKeycloakIdAsync(string keycloakId);
    Task<User?> GetUserWithSchoolAsync(Guid id);
    Task<(IEnumerable<User> Items, int TotalCount)> GetPagedUsersAsync(string? searchTerm, string? role, Guid? schoolId, int pageNumber, int pageSize);
}
