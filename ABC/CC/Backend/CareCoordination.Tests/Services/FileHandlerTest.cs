//using CareCoordination.Application.Abstracts.ServiceInterfaces;
//using CareCoordination.Application.Models;
//using CareCoordination.Services.Implementation;
//using Microsoft.AspNetCore.Http;
//using Microsoft.Extensions.Configuration;
//using Moq;
//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Net;
//using System.Text;
//using System.Threading.Tasks;
//using Xunit;
//using Moq.Protected;
//using Microsoft.AspNetCore.Mvc.DataAnnotations;
//using Newtonsoft.Json;
//using System.Diagnostics.CodeAnalysis;


//namespace CareCoordination.Tests.Services
//{
//    [ExcludeFromCodeCoverage]
//    public class FileHandlerTest
//    {
//        private readonly Mock<IConfiguration> _configurationMock;
//        private readonly Mock<IApiTokenCacheClient> _apiTokenCacheClientMock;
//        private readonly Mock<HttpMessageHandler> _httpMessageHandlerMock;
//        private readonly FileHandler _fileHandler;
//        private readonly Mock<IHttpClientFactory> _httpClientFactoryMock;

//        public FileHandlerTest()
//        {
//            _configurationMock = new Mock<IConfiguration>();
//            _apiTokenCacheClientMock = new Mock<IApiTokenCacheClient>();
//            _httpMessageHandlerMock = new Mock<HttpMessageHandler>();
//            _httpClientFactoryMock = new Mock<IHttpClientFactory>();
//            _fileHandler = new FileHandler(_configurationMock.Object, _apiTokenCacheClientMock.Object, _httpClientFactoryMock.Object);
//        }

//        [Fact]
//        public void PostToOVEndpoint_Should_Return_FileProperties_When_Upload_Succeeds()
//        {
//            // Arrange
//            var uploadedFile = new UploadedFileModel
//            {
//                file = Mock.Of<IFormFile>(f => f.FileName == "test.txt" && f.OpenReadStream() == new MemoryStream()),
//                EpisodeId = "EP123",
//                Filename = "test.txt",
//                Description = "Test File",
//                CreatedBy = "User1"
//            };

//            var token = "mockToken";
//            var responseContent = "{\"AMSObjectValetId\":\"123e4567-e89b-12d3-a456-426614174000\"}";

//            _apiTokenCacheClientMock.Setup(a => a.GetApiToken(It.IsAny<string>())).ReturnsAsync(token);
//            _configurationMock.Setup(c => c.GetSection("OAuthSettings:OV:AMSPost").Value).Returns("http://mockurl.com");
//            _configurationMock.Setup(c => c.GetSection("SecurityCert:StoreName").Value).Returns("TrustedPeople");
//            _configurationMock.Setup(c => c.GetSection("SecurityCert:StoreLocation").Value).Returns("LocalMachine");
//            _configurationMock.Setup(c => c.GetSection("SecurityCert:SubjectName").Value).Returns("CN=*.innovate.lan");
//            _configurationMock.Setup(c => c.GetSection("OAuthSettings:OV:ObjectValetApplication").Value).Returns("OVApp");
//            _configurationMock.Setup(c => c.GetSection("OAuthSettings:OV:SystemOfRecord").Value).Returns("systemofrec");
//            _configurationMock.Setup(c => c.GetSection("OAuthSettings:OV:ObjectClass").Value).Returns("OVClass");

//            _httpMessageHandlerMock.Protected()
//                .Setup<Task<HttpResponseMessage>>(
//                    "SendAsync",
//                    ItExpr.IsAny<HttpRequestMessage>(),
//                    ItExpr.IsAny<CancellationToken>())
//                .ReturnsAsync(new HttpResponseMessage
//                {
//                    StatusCode = HttpStatusCode.OK,
//                    Content = new StringContent(responseContent)
//                });


//            var httpClient = new HttpClient(_httpMessageHandlerMock.Object);
//            _httpClientFactoryMock.Setup(_ => _.CreateClient(It.IsAny<string>())).Returns(httpClient);


//            // Act
//            var result = _fileHandler.PostToOVEndpoint(uploadedFile);

//            // Assert
//            Assert.NotNull(result);
//            Assert.Equal(new Guid("123e4567-e89b-12d3-a456-426614174000"), result.AMSObjectValetId);
//        }

//        [Fact]
//        public void GetListOfObjects_Should_Return_ObjectList_When_Request_Succeeds()
//        {
//            // Arrange
//            var episodeId = "EP123";
//            var token = "mockToken";
//            var responseContent = "[{\"Id\":\"1\",\"Filename\":\"file1.txt\"},{\"Id\":\"2\",\"Filename\":\"file2.txt\"}]";

//            _apiTokenCacheClientMock.Setup(a => a.GetApiToken(It.IsAny<string>())).ReturnsAsync(token);
//            _configurationMock.Setup(c => c.GetSection("OAuthSettings:OV:AMSPost").Value).Returns("http://mockurl.com");
//            _configurationMock.Setup(c => c.GetSection("SecurityCert:StoreName").Value).Returns("TrustedPeople");
//            _configurationMock.Setup(c => c.GetSection("SecurityCert:StoreLocation").Value).Returns("LocalMachine");
//            _configurationMock.Setup(c => c.GetSection("SecurityCert:SubjectName").Value).Returns("CN=*.innovate.lan");
//            _configurationMock.Setup(c => c.GetSection("OAuthSettings:OV:ObjectValetApplication").Value).Returns("OVApp");
//            _configurationMock.Setup(c => c.GetSection("OAuthSettings:OV:SystemOfRecord").Value).Returns("systemofrec");
//            _configurationMock.Setup(c => c.GetSection("OAuthSettings:OV:ObjectClass").Value).Returns("OVClass");
//            _configurationMock.Setup(c => c.GetSection("OAuthSettings:OV:GetListOfObjects").Value).Returns("http://OVObject.com");

//            _httpMessageHandlerMock.Protected()
//               .Setup<Task<HttpResponseMessage>>(
//                   "SendAsync",
//                   ItExpr.IsAny<HttpRequestMessage>(),
//                   ItExpr.IsAny<CancellationToken>())
//               .ReturnsAsync(new HttpResponseMessage
//               {
//                   StatusCode = HttpStatusCode.OK,
//                   Content = new StringContent(responseContent)
//               });


//            var httpClient = new HttpClient(_httpMessageHandlerMock.Object);
//            _httpClientFactoryMock.Setup(_ => _.CreateClient(It.IsAny<string>())).Returns(httpClient);

//            // Act
//            var result = _fileHandler.GetListOfObjects(episodeId);

//            // Assert
//            Assert.NotNull(result);
//            Assert.Equal(2, result.Count);
//            Assert.Equal("file1.txt", result[0].Filename);
//        }

//        [Fact]
//        public void GetFileByObjectId_Should_Return_File_When_Request_Succeeds()
//        {
//            // Arrange
//            var objectId = 12345;
//            var token = "mockToken";

//            _apiTokenCacheClientMock.Setup(a => a.GetApiToken(It.IsAny<string>())).ReturnsAsync(token);
//            _configurationMock.Setup(c => c.GetSection("OAuthSettings:OV:AMSPost").Value).Returns("http://mockurl.com");
//            _configurationMock.Setup(c => c.GetSection("SecurityCert:StoreName").Value).Returns("TrustedPeople");
//            _configurationMock.Setup(c => c.GetSection("SecurityCert:StoreLocation").Value).Returns("LocalMachine");
//            _configurationMock.Setup(c => c.GetSection("SecurityCert:SubjectName").Value).Returns("CN=*.innovate.lan");
//            _configurationMock.Setup(c => c.GetSection("OAuthSettings:OV:ObjectValetApplication").Value).Returns("OVApp");
//            _configurationMock.Setup(c => c.GetSection("OAuthSettings:OV:SystemOfRecord").Value).Returns("systemofrec");
//            _configurationMock.Setup(c => c.GetSection("OAuthSettings:OV:ObjectClass").Value).Returns("OVClass");
//            _configurationMock.Setup(c => c.GetSection("OAuthSettings:OV:GetFileByObjectId").Value).Returns("http://OVObjectId.com");

//            _httpMessageHandlerMock.Protected()
//                .Setup<Task<HttpResponseMessage>>(
//                    "SendAsync",
//                    ItExpr.IsAny<HttpRequestMessage>(),
//                    ItExpr.IsAny<CancellationToken>())
//                .ReturnsAsync(new HttpResponseMessage
//                {
//                    StatusCode = HttpStatusCode.OK,
//                    Content = new StreamContent(new MemoryStream())
//                });

//            var httpClient = new HttpClient(_httpMessageHandlerMock.Object);
//            _httpClientFactoryMock.Setup(_ => _.CreateClient(It.IsAny<string>())).Returns(httpClient);
//            // Act
//            var result = _fileHandler.GetFileByObjectId(objectId);

//            // Assert
//            Assert.NotNull(result);
//            Assert.IsAssignableFrom<Stream>(result.FileStreamContent);
//        }

//        [Fact]
//        public void PostToOVEndpointShouldReturnNullWhenUploadFails()
//        {
//            // Arrange
//            var uploadedFile = new UploadedFileModel
//            {
//                file = Mock.Of<IFormFile>(f => f.FileName == "test.txt" && f.OpenReadStream() == new MemoryStream()),
//                EpisodeId = "EP123",
//                Filename = "test.txt"
//            };

//            var token = "mockToken";

//            _apiTokenCacheClientMock.Setup(a => a.GetApiToken(It.IsAny<string>())).ReturnsAsync(token);
//            _configurationMock.Setup(c => c.GetSection("OAuthSettings:OV:AMSPost").Value).Returns("http://mockurl.com");
//            _configurationMock.Setup(c => c.GetSection("SecurityCert:StoreName").Value).Returns("TrustedPeople");
//            _configurationMock.Setup(c => c.GetSection("SecurityCert:StoreLocation").Value).Returns("LocalMachine");
//            _configurationMock.Setup(c => c.GetSection("SecurityCert:SubjectName").Value).Returns("CN=*.innovate.lan");
//            _configurationMock.Setup(c => c.GetSection("OAuthSettings:OV:ObjectValetApplication").Value).Returns("OVApp");
//            _configurationMock.Setup(c => c.GetSection("OAuthSettings:OV:SystemOfRecord").Value).Returns("systemofrec");
//            _configurationMock.Setup(c => c.GetSection("OAuthSettings:OV:ObjectClass").Value).Returns("OVClass");

//            _httpMessageHandlerMock.Protected()
//                .Setup<Task<HttpResponseMessage>>(
//                    "SendAsync",
//                    ItExpr.IsAny<HttpRequestMessage>(),
//                    ItExpr.IsAny<CancellationToken>())
//                .ReturnsAsync(new HttpResponseMessage { StatusCode = HttpStatusCode.BadRequest });


//            var httpClient = new HttpClient(_httpMessageHandlerMock.Object);
//            _httpClientFactoryMock.Setup(_ => _.CreateClient(It.IsAny<string>())).Returns(httpClient);

//            // Act
//            var result = _fileHandler.PostToOVEndpoint(uploadedFile);

//            // Assert
//            Assert.Null(result);
//        }
//    }
//}
