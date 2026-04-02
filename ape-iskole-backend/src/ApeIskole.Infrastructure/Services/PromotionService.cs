using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ApeIskole.Application.DTOs;
using ApeIskole.Application.Interfaces;
using ApeIskole.Domain.Entities;

namespace ApeIskole.Infrastructure.Services;

public class PromotionService : IPromotionService
{
    private readonly IPromotionRepository _promotionRepository;
    private readonly ICloudinaryService _cloudinaryService;
    private readonly IUnitOfWork _unitOfWork;

    public PromotionService(
        IPromotionRepository promotionRepository, 
        ICloudinaryService cloudinaryService,
        IUnitOfWork unitOfWork)
    {
        _promotionRepository = promotionRepository;
        _cloudinaryService = cloudinaryService;
        _unitOfWork = unitOfWork;
    }

    public async Task<IReadOnlyList<PromotionDto>> GetAllActivePromotionsAsync()
    {
        var promotions = await _promotionRepository.GetActivePromotionsAsync();
        return promotions.Select(MapToDto).ToList();
    }

    public async Task<IReadOnlyList<PromotionDto>> GetAllPromotionsAdminAsync()
    {
        var promotions = await _promotionRepository.GetAllAsync();
        return promotions.OrderByDescending(p => p.CreatedAt).Select(MapToDto).ToList();
    }

    public async Task<PromotionDto?> GetPromotionByIdAsync(Guid id)
    {
        var promotion = await _promotionRepository.GetByIdAsync(id);
        if (promotion == null) return null;
        return MapToDto(promotion);
    }

    public async Task<PromotionDto> CreatePromotionAsync(CreatePromotionRequest request)
    {
        string imageUrl = request.Image;
        if (request.ImageFile != null)
        {
            var fileDto = new FileDto
            {
                FileName = request.ImageFile.FileName,
                ContentType = request.ImageFile.ContentType,
                Content = request.ImageFile.OpenReadStream()
            };
            var result = await _cloudinaryService.UploadImageAsync(fileDto, "promotions");
            if (result != null) imageUrl = result;
        }

        var promotion = new Promotion
        {
            Title = request.Title,
            Brand = request.Brand,
            Category = request.Category,
            Discount = request.Discount,
            OriginalPrice = request.OriginalPrice,
            DiscountedPrice = request.DiscountedPrice,
            Description = request.Description,
            LongDescription = request.LongDescription,
            Image = imageUrl,
            ValidUntil = request.ValidUntil.HasValue ? DateTime.SpecifyKind(request.ValidUntil.Value, DateTimeKind.Utc) : null,
            Terms = request.Terms,
            Code = request.Code,
            Url = request.Url,
            Featured = request.Featured,
            Limit = request.Limit,
            IsActive = request.IsActive,
            Uses = 0,
            CreatedAt = DateTime.UtcNow
        };

        await _promotionRepository.AddAsync(promotion);
        await _unitOfWork.SaveChangesAsync();
        return MapToDto(promotion);
    }

    public async Task<PromotionDto?> UpdatePromotionAsync(Guid id, UpdatePromotionRequest request)
    {
        var promotion = await _promotionRepository.GetByIdAsync(id);
        if (promotion == null) return null;

        if (request.ImageFile != null)
        {
            var fileDto = new FileDto
            {
                FileName = request.ImageFile.FileName,
                ContentType = request.ImageFile.ContentType,
                Content = request.ImageFile.OpenReadStream()
            };
            var result = await _cloudinaryService.UploadImageAsync(fileDto, "promotions");
            if (result != null) promotion.Image = result;
        }
        else if (!string.IsNullOrEmpty(request.Image))
        {
            promotion.Image = request.Image;
        }

        promotion.Title = request.Title;
        promotion.Brand = request.Brand;
        promotion.Category = request.Category;
        promotion.Discount = request.Discount;
        promotion.OriginalPrice = request.OriginalPrice;
        promotion.DiscountedPrice = request.DiscountedPrice;
        promotion.Description = request.Description;
        promotion.LongDescription = request.LongDescription;
        promotion.ValidUntil = request.ValidUntil.HasValue ? DateTime.SpecifyKind(request.ValidUntil.Value, DateTimeKind.Utc) : null;
        promotion.Terms = request.Terms;
        promotion.Code = request.Code;
        promotion.Url = request.Url;
        promotion.Featured = request.Featured;
        promotion.Limit = request.Limit;
        promotion.IsActive = request.IsActive;

        _promotionRepository.Update(promotion);
        await _unitOfWork.SaveChangesAsync();

        return MapToDto(promotion);
    }

    public async Task<bool> DeletePromotionAsync(Guid id)
    {
        var promotion = await _promotionRepository.GetByIdAsync(id);
        if (promotion == null) return false;

        _promotionRepository.Remove(promotion);
        await _unitOfWork.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ClaimPromotionAsync(Guid id)
    {
        var success = await _promotionRepository.IncrementUsesAsync(id);
        if (success)
        {
            await _unitOfWork.SaveChangesAsync();
        }
        return success;
    }

    private static PromotionDto MapToDto(Promotion p)
    {
        return new PromotionDto
        {
            Id = p.Id,
            Title = p.Title,
            Brand = p.Brand,
            Category = p.Category,
            Discount = p.Discount,
            OriginalPrice = p.OriginalPrice,
            DiscountedPrice = p.DiscountedPrice,
            Description = p.Description,
            LongDescription = p.LongDescription,
            Image = p.Image,
            ValidUntil = p.ValidUntil,
            Terms = p.Terms,
            Code = p.Code,
            Url = p.Url,
            Featured = p.Featured,
            Uses = p.Uses,
            Limit = p.Limit,
            IsActive = p.IsActive,
            CreatedAt = p.CreatedAt
        };
    }
}
