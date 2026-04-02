using System.Collections.Generic;
using System.Threading.Tasks;
using ApeIskole.Application.DTOs;

namespace ApeIskole.Application.Interfaces;

public interface ICloudinaryService
{
    Task<string?> UploadImageAsync(FileDto file, string folder);
    Task<List<string>> UploadImagesAsync(List<FileDto> files, string folder);
    Task<bool> DeleteImageAsync(string imageUrl);
}
