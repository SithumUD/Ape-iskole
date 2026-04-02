using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ApeIskole.Application.DTOs;

namespace ApeIskole.Application.Interfaces;

public interface IUserService
{
    Task<UserDto> SyncUserAsync(SyncUserRequest request);
    Task<UserDto> CreateUserAsync(CreateUserRequest request);
    Task<UserDto?> GetUserProfileAsync(string keycloakId);
    Task<(IEnumerable<UserDto> Items, int TotalCount)> GetPagedUsersAsync(string? searchTerm, string? role, Guid? schoolId, int pageNumber, int pageSize);
    Task<UserDto?> GetUserByIdAsync(Guid id);
    Task<UserDto> UpdateUserAsync(Guid id, UpdateUserRequest request);
    Task<bool> DeleteUserAsync(Guid id);
    Task<bool> VerifyUserAsync(Guid id, bool isVerified);
    Task<bool> ToggleStudentStatusAsync(Guid id, bool isStudent);
}
