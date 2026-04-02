using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ApeIskole.Domain.Entities;

namespace ApeIskole.Application.Interfaces;

public interface ICommentRepository : IBaseRepository<Comment>
{
    Task<IEnumerable<Comment>> GetCommentsByStoryIdAsync(Guid storyId);
}
