using ApeIskole.Application.DTOs;
using ApeIskole.Application.Interfaces;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

namespace ApeIskole.Infrastructure.Services;

public class CloudinaryService : ICloudinaryService
{
    private readonly Cloudinary _cloudinary;

    public CloudinaryService(IConfiguration configuration)
    {
        var account = new Account(
            configuration["Cloudinary:CloudName"],
            configuration["Cloudinary:ApiKey"],
            configuration["Cloudinary:ApiSecret"]
        );
        _cloudinary = new Cloudinary(account);
    }

    public async Task<string?> UploadImageAsync(FileDto file, string folder)
    {
        if (file == null || file.Content == null || file.Content.Length == 0) return null;

        var uploadParams = new ImageUploadParams
        {
            File = new FileDescription(file.FileName, file.Content),
            Folder = $"ApeIskole/{folder}",
            Transformation = new Transformation().Quality("auto").FetchFormat("auto")
        };

        var uploadResult = await _cloudinary.UploadAsync(uploadParams);
        return uploadResult.SecureUrl?.ToString();
    }

    public async Task<List<string>> UploadImagesAsync(List<FileDto> files, string folder)
    {
        var urls = new List<string>();
        if (files == null || files.Count == 0) return urls;

        foreach (var file in files)
        {
            var url = await UploadImageAsync(file, folder);
            if (url != null) urls.Add(url);
        }

        return urls;
    }

    public async Task<bool> DeleteImageAsync(string imageUrl)
    {
        if (string.IsNullOrEmpty(imageUrl)) return false;

        // Extract public ID from URL
        var uri = new Uri(imageUrl);
        var publicId = Path.GetFileNameWithoutExtension(uri.AbsolutePath);
        
        // This is a simplified extraction. Cloudinary public IDs can include folders.
        // For production, you might want more robust extraction or store public IDs in DB.
        
        var deletionParams = new DeletionParams(publicId);
        var result = await _cloudinary.DestroyAsync(deletionParams);
        
        return result.Result == "ok";
    }
}
