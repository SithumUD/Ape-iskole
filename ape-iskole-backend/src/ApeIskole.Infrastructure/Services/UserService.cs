using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ApeIskole.Application.DTOs;
using ApeIskole.Application.Interfaces;
using ApeIskole.Domain.Entities;
using ApeIskole.Domain.Common;

namespace ApeIskole.Infrastructure.Services;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IKeycloakAdminService _keycloakAdminService;
    private readonly IBrevoEmailService _brevoEmailService;

    public UserService(
        IUserRepository userRepository, 
        IUnitOfWork unitOfWork,
        IKeycloakAdminService keycloakAdminService,
        IBrevoEmailService brevoEmailService)
    {
        _userRepository = userRepository;
        _unitOfWork = unitOfWork;
        _keycloakAdminService = keycloakAdminService;
        _brevoEmailService = brevoEmailService;
    }

    public async Task<UserDto> SyncUserAsync(SyncUserRequest request)
    {
        var existingUser = await _userRepository.GetByKeycloakIdAsync(request.KeycloakId);

        if (existingUser != null)
        {
            // 🛡️ DEFENSIVE SYNC: Do not downgrade an existing admin/staff role to a default role
            // unless Keycloak explicitly providing a specialized role (not just the default).
            bool isExistingAdmin = existingUser.Role == UserRoles.SuperAdmin || 
                                  existingUser.Role == UserRoles.SchoolAdmin || 
                                  existingUser.Role == UserRoles.Moderator;

            bool incomingIsDefault = string.IsNullOrEmpty(request.Role) || request.Role == UserRoles.PublicUser;

            // Only update the role if the incoming role is NOT a downgrade, 
            // OR if the existing user is just a public user.
            if (!isExistingAdmin || !incomingIsDefault)
            {
                existingUser.Role = request.Role;
            }

            existingUser.FullName = request.FullName;
            existingUser.Email = request.Email;
            if (request.SchoolId.HasValue)
            {
                existingUser.SchoolId = request.SchoolId;
            }
            existingUser.IsStudent = request.IsStudent;
            
            _userRepository.Update(existingUser);
            await _unitOfWork.SaveChangesAsync();
            
            return MapToDto(existingUser);
        }

        var newUser = new User
        {
            KeycloakId = request.KeycloakId,
            FullName = request.FullName,
            Email = request.Email,
            Role = request.Role,
            SchoolId = request.SchoolId,
            IsStudent = request.IsStudent,
            IsVerified = false
        };

        await _userRepository.AddAsync(newUser);
        await _unitOfWork.SaveChangesAsync();

        return MapToDto(newUser);
    }

    public async Task<UserDto> CreateUserAsync(CreateUserRequest request)
    {
        // 1. Generate temp password
        var password = Guid.NewGuid().ToString("N").Substring(0, 10);

        // 2. Create in Keycloak
        var keycloakId = await _keycloakAdminService.CreateUserAsync(
            request.Email, 
            request.FullName, 
            password, 
            request.Role);

        // 3. Sync to DB
        var user = new User
        {
            KeycloakId = keycloakId,
            FullName = request.FullName,
            Email = request.Email,
            Role = request.Role,
            SchoolId = request.SchoolId,
            IsStudent = request.IsStudent,
            IsVerified = true // Admin created users are verified by default
        };

        await _userRepository.AddAsync(user);
        await _unitOfWork.SaveChangesAsync();

        // 4. Send Credentials Email
        await _brevoEmailService.SendCredentialsEmailAsync(
            request.Email, 
            request.FullName, 
            request.Email, 
            password);

        return MapToDto(user);
    }

    public async Task<UserDto?> GetUserProfileAsync(string keycloakId)
    {
        var user = await _userRepository.GetByKeycloakIdAsync(keycloakId);
        if (user == null) return null;
        
        return MapToDto(user);
    }

    public async Task<(IEnumerable<UserDto> Items, int TotalCount)> GetPagedUsersAsync(string? searchTerm, string? role, Guid? schoolId, int pageNumber, int pageSize)
    {
        var (items, totalCount) = await _userRepository.GetPagedUsersAsync(searchTerm, role, schoolId, pageNumber, pageSize);
        return (items.Select(MapToDto), totalCount);
    }

    public async Task<UserDto?> GetUserByIdAsync(Guid id)
    {
        var user = await _userRepository.GetByIdAsync(id);
        return user != null ? MapToDto(user) : null;
    }

    public async Task<UserDto> UpdateUserAsync(Guid id, UpdateUserRequest request)
    {
        var user = await _userRepository.GetByIdAsync(id);
        if (user == null) throw new KeyNotFoundException("User not found");

        user.FullName = request.FullName;
        user.Role = request.Role;
        user.SchoolId = request.SchoolId;
        user.IsStudent = request.IsStudent;

        _userRepository.Update(user);
        await _unitOfWork.SaveChangesAsync();

        return MapToDto(user);
    }

    public async Task<bool> DeleteUserAsync(Guid id)
    {
        var user = await _userRepository.GetByIdAsync(id);
        if (user == null) return false;

        _userRepository.Remove(user);
        return await _unitOfWork.SaveChangesAsync() > 0;
    }

    public async Task<bool> VerifyUserAsync(Guid id, bool isVerified)
    {
        var user = await _userRepository.GetByIdAsync(id);
        if (user == null) return false;

        user.IsVerified = isVerified;
        _userRepository.Update(user);
        return await _unitOfWork.SaveChangesAsync() > 0;
    }

    public async Task<bool> ToggleStudentStatusAsync(Guid id, bool isStudent)
    {
        var user = await _userRepository.GetByIdAsync(id);
        if (user == null) return false;

        user.IsStudent = isStudent;
        _userRepository.Update(user);
        return await _unitOfWork.SaveChangesAsync() > 0;
    }

    private static UserDto MapToDto(User user)
    {
        return new UserDto
        {
            Id = user.Id,
            KeycloakId = user.KeycloakId,
            FullName = user.FullName,
            Email = user.Email,
            Role = user.Role,
            SchoolId = user.SchoolId,
            SchoolName = user.School?.Name,
            IsVerified = user.IsVerified,
            IsStudent = user.IsStudent,
            CreatedAt = user.CreatedAt,
            UpdatedAt = user.UpdatedAt
        };
    }
}
