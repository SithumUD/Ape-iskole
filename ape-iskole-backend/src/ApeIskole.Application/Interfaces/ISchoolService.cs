using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ApeIskole.Application.DTOs;

namespace ApeIskole.Application.Interfaces;

public interface ISchoolService
{
    Task<SchoolDto> RegisterSchoolAsync(CreateSchoolRequest request);
    Task<(IEnumerable<SchoolDto> Items, int TotalCount)> GetSchoolsAsync(string? searchTerm, string? type, string? city, int pageNumber, int pageSize, bool? isActive = null, bool? isApproved = null);
    Task<SchoolDto?> GetSchoolByIdAsync(Guid id);
    Task<SchoolDto> UpdateSchoolAsync(Guid id, UpdateSchoolRequest request);
    Task<bool> SoftDeleteSchoolAsync(Guid id);
    Task<bool> HardDeleteSchoolAsync(Guid id);
    Task<SchoolDto> UpdateImagesAsync(Guid id, FileDto? logo, FileDto? cover, List<FileDto>? gallery);
    Task<bool> ApproveSchoolAsync(Guid id);
    Task<bool> RejectSchoolAsync(Guid id, string reason);
    Task<bool> ToggleActiveStatusAsync(Guid id, bool isActive);
    Task<UserDto> CreateSchoolUserAsync(Guid schoolId, CreateSchoolUserRequest request);
    Task<HomeDataDto> GetHomeDataAsync();
}
