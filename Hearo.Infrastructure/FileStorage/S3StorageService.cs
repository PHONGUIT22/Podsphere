using Amazon.S3;
using Amazon.S3.Transfer;
using Hearo.Application.Common.Interfaces.Services;
using Microsoft.Extensions.Configuration;

namespace Hearo.Infrastructure.FileStorage;

public class S3StorageService : IFileStorageService
{
    private readonly IAmazonS3 _s3Client;
    private readonly string _bucketName;
    private readonly string _serviceUrl;
    public S3StorageService(IAmazonS3 s3Client, IConfiguration configuration)
    {
        _s3Client = s3Client;
        _bucketName = configuration["AWS:BucketName"] ?? string.Empty;
        _serviceUrl = configuration["AWS:ServiceUrl"] ?? string.Empty;
    }

    public async Task<string> UploadFileAsync(Stream fileStream, string fileName, string contentType)
    {
        var fileTransferUtility = new TransferUtility(_s3Client);
        
        var uploadRequest = new TransferUtilityUploadRequest
        {
            InputStream = fileStream,
            Key = fileName, // Tên file trên S3 (ví dụ: episodes/audio1.mp3)
            BucketName = _bucketName,
            ContentType = contentType
        };

        await fileTransferUtility.UploadAsync(uploadRequest);
        
        // Trả về URL để lưu vào Database
        return $"{_serviceUrl}/{_bucketName}/{fileName}";
    }

    public async Task DeleteFileAsync(string fileUrl)
    {
        var fileName = fileUrl.Split('/').Last();
        await _s3Client.DeleteObjectAsync(_bucketName, fileName);
    }
}