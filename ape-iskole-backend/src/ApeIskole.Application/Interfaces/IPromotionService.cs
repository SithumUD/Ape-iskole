using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ApeIskole.Application.DTOs;

namespace ApeIskole.Application.Interfaces;

public interface IPromotionService
{
    Task<IReadOnlyList<PromotionDto>> GetAllActivePromotionsAsync();
    Task<IReadOnlyList<PromotionDto>> GetAllPromotionsAdminAsync();
    Task<PromotionDto?> GetPromotionByIdAsync(Guid id);
    Task<PromotionDto> CreatePromotionAsync(CreatePromotionRequest request);
    Task<PromotionDto?> UpdatePromotionAsync(Guid id, UpdatePromotionRequest request);
    Task<bool> DeletePromotionAsync(Guid id);
    Task<bool> ClaimPromotionAsync(Guid id);
}
