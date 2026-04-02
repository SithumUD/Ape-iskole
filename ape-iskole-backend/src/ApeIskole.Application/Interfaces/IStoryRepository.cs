using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ApeIskole.Domain.Entities;

namespace ApeIskole.Application.Interfaces;

public interface IStoryRepository : IBaseRepository<Story>
{
    Task<Story?> GetStoryWithDetailsAsync(Guid id);
    Task<(IEnumerable<Story> Items, int TotalCount)> GetPagedStoriesAsync(
        string? searchTerm, 
        string? category, 
        Guid? schoolId, 
        string? tag,
        bool? isPublished,
        int pageNumber, 
        int pageSize);
}
