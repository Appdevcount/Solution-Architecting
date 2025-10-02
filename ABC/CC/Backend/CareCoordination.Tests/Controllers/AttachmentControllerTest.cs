using AutoMapper;
using CareCoordination.Api.Controllers;
using CareCoordination.Api.DTOs;
using CareCoordination.Application.Abstracts.HandlerInterfaces;
using CareCoordination.Application.Logger;
using CareCoordination.Application.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Moq;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Text;
using Xunit;

namespace CareCoordination.Tests.Controllers
{
    public class AttachmentControllerTest
    {
        private readonly Mock<IApplicationLogger> _loggerMock;
        private readonly Mock<IMapper> _mapperMock;
        private readonly Mock<IAttachmentManagement> _attachmentManagementMock;
        private readonly AttachmentsController _controller;

        public AttachmentControllerTest()
        {
            _loggerMock = new Mock<IApplicationLogger>();
            _mapperMock = new Mock<IMapper>();
            _attachmentManagementMock = new Mock<IAttachmentManagement>();
            _controller = new AttachmentsController(_loggerMock.Object, _mapperMock.Object, _attachmentManagementMock.Object);
        }

        [Fact]
        public void UploadFile_Should_Return_BadRequest_When_File_Is_Null()
        {

            var userId = "test-user";
            var claims = new[] { new System.Security.Claims.Claim("sub", userId) };
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("secure_test_key_for_generating_bearer_token_for_testing_123"));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(30),
                signingCredentials: creds
                );
            var jwt = new JwtSecurityTokenHandler().WriteToken(token);

            var context = new DefaultHttpContext();
            context.Request.Headers.Authorization = $"Bearer {jwt}";


            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = context
            };
            // Act

            string actualmsg = "";
            _loggerMock.Setup(x => x.LogError(It.IsAny<string>())).Callback<string>(msg => actualmsg = msg);
            var result = _controller.UploadFile(null, null, null, null, null);


            // Assert
            Assert.IsType<BadRequestResult>(result);
            Assert.Equal("AttachmentController-UploadFile: Failed to upload File.", actualmsg);
            _loggerMock.Verify(x => x.LogError("AttachmentController-UploadFile: Failed to upload File."), Times.Once);

        }

        [Fact]
        public void UploadFile_Should_Return_NotFound_When_File_Is_Invalid()
        {
            // Arrange

            var userId = "test-user";
            var claims = new[] { new System.Security.Claims.Claim("sub", userId) };
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("secure_test_key_for_generating_bearer_token_for_testing_123"));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(30),
                signingCredentials: creds
                );
            var jwt = new JwtSecurityTokenHandler().WriteToken(token);

            var context = new DefaultHttpContext();
            context.Request.Headers.Authorization = $"Bearer {jwt}";


            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = context
            };


            string EpisodeId = "";
            IFormFile file = Mock.Of<IFormFile>(x => x.FileName == "test.txt");
            string fileName = "";
            string createdBy = "";
            string DocumentType = "";
            string actualmsg = "";         


            // Act          
            _loggerMock.Setup(x => x.LogError(It.IsAny<string>())).Callback<string>(msg => actualmsg = msg);
            var result = _controller.UploadFile(EpisodeId, file, fileName, createdBy, DocumentType);
            _loggerMock.Verify(x => x.LogError("AttachmentController-UploadFile: Failed to upload File."), Times.Once);

            Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("AttachmentController-UploadFile: Failed to upload File.", actualmsg);

        }

        [Fact]
        public void UploadFile_Should_Return_Ok_When_File_Is_Valid()
        {
            // Arrange
            var userId = "test-user";
            var claims = new[] { new System.Security.Claims.Claim("sub", userId) };
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("secure_test_key_for_generating_bearer_token_for_testing_123"));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(30),
                signingCredentials: creds
                );
            var jwt = new JwtSecurityTokenHandler().WriteToken(token);

            var context = new DefaultHttpContext();
            context.Request.Headers.Authorization = $"Bearer {jwt}";


            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = context
            };

            string EpisodeId = "1";
            IFormFile file = Mock.Of<IFormFile>(x => x.FileName == "test.txt");
            string fileName = "test.txt";
            string createdBy = "bhushan.patil1";
            string DocumentType = "text";

            var mappedModel = new UploadedFileModel();
            var uploadedFilePropertiesModel = new UploadedFilePropertiesModel { AMSObjectValetId = Guid.NewGuid() };
            _mapperMock.Setup(m => m.Map<UploadedFileModel>(It.IsAny<UploadedFile>())).Returns(mappedModel);
            _attachmentManagementMock.Setup(a => a.PostToOVEndpoint(It.IsAny<UploadedFileModel>())).Returns(uploadedFilePropertiesModel);

            // Act
            var result = _controller.UploadFile(EpisodeId, file, fileName, createdBy, DocumentType) as OkObjectResult;

            // Assert
            Assert.NotNull(result);
            _loggerMock.Verify(x => x.LogInformation("AttachmentsController: UploadFile Started for  EpisodeId: - 1 and  Filename : test.txt"), Times.Once);
            _loggerMock.Verify(x => x.LogInformation("AttachmentsController: UploadFile completed for  EpisodeId: - 1 and  Filename : test.txt"), Times.Once);
            Assert.True(Convert.ToBoolean(result?.Value?.GetType()?.GetProperty("FileUploadSuccess")?.GetValue(result.Value)));
        }

        [Fact]
        public void UploadFile_Should_ThrowException_When_File_Is_InValid()
        {
            // Arrange
            var userId = "test-user";
            var claims = new[] { new System.Security.Claims.Claim("sub", userId) };
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("secure_test_key_for_generating_bearer_token_for_testing_123"));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(30),
                signingCredentials: creds
                );
            var jwt = new JwtSecurityTokenHandler().WriteToken(token);

            var context = new DefaultHttpContext();
            context.Request.Headers.Authorization = $"Bearer {jwt}";


            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = context
            };

            string EpisodeId = "1";
            IFormFile file = Mock.Of<IFormFile>(x => x.FileName == "test.txt");
            string fileName = "test.txt";
            string createdBy = "";
            string DocumentType = "";
            string exceptionMessage = "AttachmentsController: UploadFile error for  EpisodeId: - 1";
            var  exception = new NullReferenceException("Test Exception");
   
            var mappedModel = new UploadedFileModel();
            var uploadedFilePropertiesModel = new UploadedFilePropertiesModel { AMSObjectValetId = Guid.NewGuid() };

            _mapperMock.Setup(m => m.Map<UploadedFileModel>(It.IsAny<UploadedFile>())).Returns(mappedModel);
            _attachmentManagementMock.Setup(a => a.PostToOVEndpoint(It.IsAny<UploadedFileModel>())).Throws(exception);

            // Act
            var result = _controller.UploadFile(EpisodeId, file, fileName, createdBy, DocumentType) as ObjectResult;
            Assert.NotNull(result);

            _loggerMock.Verify(x => x.LogInformation("AttachmentsController: UploadFile Started for  EpisodeId: - 1 and  Filename : test.txt"), Times.Once);
            _loggerMock.Verify(x => x.LogException(exceptionMessage,exception), Times.Once);
            Assert.Equal(result.StatusCode, StatusCodes.Status500InternalServerError);

        }

        [Fact]
        public void UploadFile_ReturnInternalServerError_OnException()
        {
            // Arrange

            var userId = "test-user";
            var claims = new[] { new System.Security.Claims.Claim("sub", userId) };
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("secure_test_key_for_generating_bearer_token_for_testing_123"));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(30),
                signingCredentials: creds
                );
            var jwt = new JwtSecurityTokenHandler().WriteToken(token);

            var context = new DefaultHttpContext();
            context.Request.Headers.Authorization = $"Bearer {jwt}";


            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = context
            };

            string EpisodeId = "1";
            IFormFile file = Mock.Of<IFormFile>(x => x.FileName == "test.txt");
            string fileName = "test.txt";
            string createdBy = "";
            string DocumentType = "";

            var mappedModel = new UploadedFileModel();
            var uploadedFilePropertiesModel = new UploadedFilePropertiesModel { AMSObjectValetId = Guid.NewGuid() };

            _mapperMock.Setup(m => m.Map<UploadedFileModel>(It.IsAny<UploadedFile>())).Returns(mappedModel);
            _attachmentManagementMock.Setup(a => a.PostToOVEndpoint(mappedModel)).Throws(new Exception("Mapping failed"));

            // Act
            var result = _controller.UploadFile(EpisodeId, file, fileName, createdBy, DocumentType);
            _loggerMock.Verify(x => x.LogInformation("AttachmentsController: UploadFile Started for  EpisodeId: - 1 and  Filename : test.txt"), Times.Once);


            // Assert
            Assert.IsType<ObjectResult>(result);
            _loggerMock.SetReturnsDefault("no error");
        }

        [Fact]
        public void GetUploadedFiles_Should_Return_BadRequest_When_EpisodeId_Is_Null()
        {
            // Act
            var result = _controller.GetUploadedFiles(null);
            _loggerMock.Verify(x => x.LogError(" AttachmentController - GetUploadedFiles(). Uploaded File not found : Bad request - No Episode ID found"), Times.Once);

            // Assert
            _loggerMock.SetReturnsDefault("error");
            Assert.IsType<BadRequestResult>(result);
        }

        [Fact]
        public void GetUploadedFiles_Should_Return_NotFound_When_No_Files_Found()
        {
            // Arrange
            var episodeId = "1";
            _attachmentManagementMock.Setup(a => a.GetListOfObjects(episodeId)).Returns((List<UploadedFileDataModel>?)null);

            // Act

            var result = _controller.GetUploadedFiles(episodeId);

            // Assert
            _loggerMock.Verify(x => x.LogInformation("AttachmentsController: GetUploadedFiles Started for  EpisodeId: - 1"), Times.Once);
            _loggerMock.Verify(x => x.LogError(" AttachmentController - GetUploadedFiles(). Uploaded File not found : Bad request - No Episode ID found"), Times.Once);

            Assert.IsType<BadRequestResult>(result);
        }

        [Fact]
        public void GetUploadedFiles_Should_Return_Ok_When_Files_Are_Found()
        {
            // Arrange
            var episodeId = "1";
            var fileList = new List<UploadedFileDataModel> { new UploadedFileDataModel() };
            _attachmentManagementMock.Setup(a => a.GetListOfObjects(episodeId)).Returns(fileList);

            // Act

            var result = _controller.GetUploadedFiles(episodeId) as OkObjectResult;

            // Assert
            Assert.NotNull(result);
            _loggerMock.Verify(x => x.LogInformation("AttachmentsController: GetUploadedFiles Started for  EpisodeId: - 1"), Times.Once);
            _loggerMock.Verify(x => x.LogInformation("AttachmentsController: GetUploadedFiles completed for  EpisodeId: - 1 with Filecount : 1"), Times.Once);

            Assert.Equal(fileList, result?.Value?.GetType()?.GetProperty("UploadedFileList")?.GetValue(result.Value));
        }
        [Fact]
        public void GetUploadedFiles_ThrowException_When_Files_Are_Found()
        {
            string exceptionMessage = "AttachmentsController: GetUploadedFiles  Error for  EpisodeId: - 1";
            var exception = new Exception("Test Exception");
            // Arrange
            var episodeId = "1";
            var fileList = new List<UploadedFileDataModel> { new UploadedFileDataModel() };
            _attachmentManagementMock.Setup(a => a.GetListOfObjects(episodeId)).Throws(exception);

            // Act
            var result = _controller.GetUploadedFiles(episodeId) as ObjectResult;

            // Assert
            Assert.NotNull(result);

            _loggerMock.Verify(x => x.LogInformation("AttachmentsController: GetUploadedFiles Started for  EpisodeId: - 1"), Times.Once);
            _loggerMock.Verify(x => x.LogException(exceptionMessage,exception), Times.Once);
            Assert.Equal(result.StatusCode, StatusCodes.Status500InternalServerError);
        }

        [Fact]
        public async Task DownloadFile_Should_Return_BadRequest_When_ObjectId_Is_Zero()
        {
            // Act
            var result = await _controller.DownloadFile(0);

            // Assert
            Assert.IsType<BadRequestResult>(result);
            _loggerMock.SetReturnsDefault("error");
            _loggerMock.Verify(x => x.LogError("AttachmentsController: DownloadFile ObjectId not received - 0"), Times.Once);

        }

        [Fact]
        public async Task DownloadFile_Should_Return_NotFound_When_File_Is_Not_Found()
        {
            // Arrange
            var objectId = 123;
            _attachmentManagementMock.Setup(a => a.GetFileByObjectId(objectId));

            // Act
            var result = await _controller.DownloadFile(objectId);

            // Assert

            _loggerMock.SetReturnsDefault("error");
            _loggerMock.Verify(x => x.LogInformation("AttachmentsController: DownloadFile Started for  ObjectID: - 123"), Times.Once);
            _loggerMock.Verify(x => x.LogError("AttachmentsController: DownloadFile  Not found  for  ObjectID: - 123"), Times.Once);


            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task DownloadFile_Should_Return_File_When_File_Is_Found()
        {
            // Arrange
            var objectId = 43624661;
            var fileToReturn = new DownloadFilePropertiesModel
            {
                FileName = "AttachmentTestdoc.pdf", // Ensuring the correct FileName
                ContentType = "",
                FileStreamContent = new System.IO.MemoryStream() // Adding file content

            };
            _attachmentManagementMock.Setup(a => a.GetFileByObjectId(objectId)).ReturnsAsync(fileToReturn);

            // Act
            var result = await _controller.DownloadFile(objectId) as FileStreamResult;

            // Assert
            Assert.NotNull(result);
            _loggerMock.SetReturnsDefault("error");

            _loggerMock.Verify(x => x.LogInformation("AttachmentsController: DownloadFile Started for  ObjectID: - 43624661"), Times.Once);
            _loggerMock.Verify(x => x.LogInformation("AttachmentsController: DownloadFile  End for  ObjectID: - 43624661"), Times.Once);

            Assert.Equal("AttachmentTestdoc.pdf", result.FileDownloadName); // Validating the file name returned
            Assert.NotNull(result.FileStream); // Ensuring the file stream content is valid
        }
        [Fact]
        public async Task DownloadFile_ThrowException_File_When_File_Is_Found()
        {
            // Arrang
            var objectId = 43624661;
            var fileToReturn = new DownloadFilePropertiesModel
            {
                FileName = "AttachmentTestdoc.pdf", // Ensuring the correct FileName
                FileStreamContent = new System.IO.MemoryStream() // Adding file content
            };
            string exceptionMessage = "AttachmentsController: DownloadFile  Error for  ObjectID: - 43624661";
            var exception = new Exception("Test Exception");

            _attachmentManagementMock.Setup(a => a.GetFileByObjectId(objectId)).Throws(exception);

            // Act
            var result = await _controller.DownloadFile(objectId) as ObjectResult;

            // Assert
            Assert.NotNull(result);
            _loggerMock.Verify(x => x.LogInformation("AttachmentsController: DownloadFile Started for  ObjectID: - 43624661"), Times.Once);
            _loggerMock.Verify(x => x.LogException(exceptionMessage,exception), Times.Once);

            _loggerMock.SetReturnsDefault("error");
            Assert.Equal(result.StatusCode, StatusCodes.Status500InternalServerError);
        }
        [Fact]
        public async Task DeleteFile_Should_Return_BadRequest_When_EpisodeId_Is_Null()
        {
            var request = new DeleteFilePropertiesViewModel
            {
                ObjectId = 0,
                EpisodeId = null
            };
            _attachmentManagementMock.Setup(x => x.DeleteFile(request)).ThrowsAsync(new ArgumentException(""));
            // Act
            var res = await _controller.DeleteFile(request) as ObjectResult;
            Assert.Equal(res.StatusCode, StatusCodes.Status400BadRequest);
            _loggerMock.Verify(x => x.LogException(It.IsAny<string>(), It.IsAny<Exception>()), Times.Once);


        }

        [Fact]
        public async Task DeleteFiles_Should_Return_NotDeleted_When_No_Files_Found()
        {
            // Arrange
            var request = new DeleteFilePropertiesViewModel
            {
                ObjectId = 12345,
                EpisodeId = "1234679"
            };
            var exception = new Exception("Error");
            _attachmentManagementMock.Setup(am => am.DeleteFile(request)).Throws(exception);
            var result = await _controller.DeleteFile(request);
            var statusCodeResult = Assert.IsType<ObjectResult>(result);
            Assert.Equal((int)HttpStatusCode.InternalServerError, statusCodeResult.StatusCode);
            Assert.Equal("Error", statusCodeResult.Value);
            _loggerMock.Verify(x => x.LogInformation(It.IsAny<string>()), Times.Once);
            _loggerMock.Verify(x => x.LogException(It.IsAny<string>(), It.IsAny<Exception>()), Times.Once);
        }
    }
}
