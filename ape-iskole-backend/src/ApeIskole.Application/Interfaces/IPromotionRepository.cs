using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ApeIskole.Domain.Entities;

namespace ApeIskole.Application.Interfaces;

public interface IPromotionRepository : IBaseRepository<Promotion>
{
    Task<IReadOnlyList<Promotion>> GetActivePromotionsAsync();
    Task<bool> IncrementUsesAsync(Guid id);
}
