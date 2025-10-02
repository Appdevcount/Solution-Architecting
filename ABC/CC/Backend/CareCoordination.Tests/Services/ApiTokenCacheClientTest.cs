using Azure.Core;
using CareCoordination.Application.Abstracts.DALInterfaces;
using CareCoordination.Application.Abstracts.HandlerInterfaces;
using CareCoordination.Application.Abstracts.ServiceInterfaces;
using CareCoordination.Application.Models;
using CareCoordination.Services.Implementation;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Moq;
using Moq.Protected;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace CareCoordination.Tests.Services
{
    public class ApiTokenCacheClientTest
    {
        private readonly Mock<ILogger<ApiTokenCacheClient>> _applicationLoggerMock;
        private readonly Mock<IConfiguration> _configMock;
        private readonly Mock<IMemoryCache> _cacheMock;
        private ApiTokenCacheClient? _apiTokenCacheClient;
        private readonly Mock<IHttpClientFactory> _httpClientFactoryMock;
        private readonly Mock<HttpMessageHandler> _httpMessageHandlerMock;

        public ApiTokenCacheClientTest()
        {
            _applicationLoggerMock = new Mock<ILogger<ApiTokenCacheClient>>();
            _configMock = new Mock<IConfiguration>();
            _cacheMock = new Mock<IMemoryCache>();
            _httpMessageHandlerMock = new Mock<HttpMessageHandler>();
            _httpClientFactoryMock = new Mock<IHttpClientFactory>();

        }

        [Fact]
        public async Task GetApiToken_FromCache_Success()
        {
            _apiTokenCacheClient = new ApiTokenCacheClient(_configMock.Object, _cacheMock.Object, _applicationLoggerMock.Object, _httpClientFactoryMock.Object);
            var token = new AccessTokenItem
            {
                Access_token = "Cached_Token",
                ExpiresIn = DateTime.UtcNow.AddDays(1),
                Expires_in = 5,
                Ext_expires_in = 5,
                Token_type = "nabc"

            };
            object? outValue = token;
            string apiName = "TestApiName";
            _cacheMock.Setup(x => x.TryGetValue(It.IsAny<string>(), out outValue)).Returns(true);
            var res = await _apiTokenCacheClient.GetApiToken(apiName);
            Assert.NotNull(res);
            Assert.Equal("Cached_Token", res);
        }

        [Fact]
        public async Task GetApiToken_FromCache_WhenTokenIsExpired_generate_new_token()
        {
            var header = new OAuthTokenFetchHeaders
            {
                AccessTokenURL = "https://testURL.com",
                ScopeURL = "https://testURL.com",
                ClientSecret = "CSecret",
                ClientID = Guid.NewGuid().ToString(),
                GrantType = "test"
            };
            _configMock.Setup(x => x.GetSection("OAuthSettings:OV:AccessTokenUrl").Value).Returns(header.AccessTokenURL);
            _configMock.Setup(x => x.GetSection("OAuthSettings:OV:ScopeUrl").Value).Returns(header.ScopeURL);
            _configMock.Setup(x => x.GetSection("OAuthSettings:OV:UPADSScopeUrl").Value).Returns("https://testURL.com");
            _configMock.Setup(x => x.GetSection("OAuthSettings:OV:ClientId").Value).Returns(header.ClientID);
            _configMock.Setup(x => x.GetSection("OAuthSettings:OV:ClientSecret").Value).Returns(header.ClientSecret);

            var token = new AccessTokenItem
            {
                Access_token = "new token",
                ExpiresIn = DateTime.UtcNow.AddDays(-1),
                Expires_in = 5,
                Ext_expires_in = 5,
                Token_type = "nabc"

            };
            var serializedToken = JsonConvert.SerializeObject(token);
            _httpMessageHandlerMock.Protected()
                .Setup<Task<HttpResponseMessage>>(
                    "SendAsync",
                    ItExpr.IsAny<HttpRequestMessage>(),
                    ItExpr.IsAny<CancellationToken>())
                .ReturnsAsync(new HttpResponseMessage
                {
                    StatusCode = HttpStatusCode.OK,
                    Content = new StringContent(serializedToken)
                });


            var httpClient = new HttpClient(_httpMessageHandlerMock.Object);
            _httpClientFactoryMock.Setup(_ => _.CreateClient(It.IsAny<string>())).Returns(httpClient);

            _apiTokenCacheClient = new ApiTokenCacheClient(_configMock.Object, _cacheMock.Object, _applicationLoggerMock.Object, _httpClientFactoryMock.Object);
            object? outValue = token;
            var mockCacheentry = new Mock<ICacheEntry>();
            string apiName = "TestApiName";
            _cacheMock.Setup(x => x.TryGetValue(It.IsAny<string>(), out outValue)).Returns(true);

            _cacheMock.Setup(x => x.CreateEntry(It.IsAny<object>())).Returns(mockCacheentry.Object);
            var res = await _apiTokenCacheClient.GetApiToken(apiName);

            Assert.NotNull(res);
            Assert.Equal("new token", res);
        }
        [Fact]
        public async Task GetApiToken_FromCache_WhenTokenIsExpiredAndnNull()
        {
            var header = new OAuthTokenFetchHeaders
            {
                AccessTokenURL = "https://testURL.com",
                ScopeURL = "https://testURL.com",
                ClientSecret = "CSecret",
                ClientID = Guid.NewGuid().ToString(),
                GrantType = "test"
            };
            _configMock.Setup(x => x.GetSection("OAuthSettings:OV:AccessTokenUrl").Value).Returns(header.AccessTokenURL);
            _configMock.Setup(x => x.GetSection("OAuthSettings:OV:ScopeUrl").Value).Returns(header.ScopeURL);
            _configMock.Setup(x => x.GetSection("OAuthSettings:OV:UPADSScopeUrl").Value).Returns("https://testURL.com");
            _configMock.Setup(x => x.GetSection("OAuthSettings:OV:ClientId").Value).Returns(header.ClientID);
            _configMock.Setup(x => x.GetSection("OAuthSettings:OV:ClientSecret").Value).Returns(header.ClientSecret);

            var token = new AccessTokenItem
            {
                Access_token = null,
                ExpiresIn = DateTime.UtcNow.AddDays(-1),
                Expires_in = 5,
                Ext_expires_in = 5,
                Token_type = "nabc"

            };
            var serializedToken = JsonConvert.SerializeObject(token);
            _httpMessageHandlerMock.Protected()
                .Setup<Task<HttpResponseMessage>>(
                    "SendAsync",
                    ItExpr.IsAny<HttpRequestMessage>(),
                    ItExpr.IsAny<CancellationToken>())
                .ReturnsAsync(new HttpResponseMessage
                {
                    StatusCode = HttpStatusCode.OK,
                    Content = new StringContent(serializedToken)
                });


            var httpClient = new HttpClient(_httpMessageHandlerMock.Object);
            _httpClientFactoryMock.Setup(_ => _.CreateClient(It.IsAny<string>())).Returns(httpClient);

            _apiTokenCacheClient = new ApiTokenCacheClient(_configMock.Object, _cacheMock.Object, _applicationLoggerMock.Object, _httpClientFactoryMock.Object);
            object? outValue = token;
            var mockCacheentry = new Mock<ICacheEntry>();
            string apiName = "TestApiName";
            _cacheMock.Setup(x => x.TryGetValue(It.IsAny<string>(), out outValue)).Returns(false);

            _cacheMock.Setup(x => x.CreateEntry(It.IsAny<object>())).Returns(mockCacheentry.Object);
            var res = await _apiTokenCacheClient.GetApiToken(apiName);

            Assert.Null(res);
        }
        [Fact]
        public void CreateOAuthTokenFetchHeaders_SetupHeader()
        {
            var header = new OAuthTokenFetchHeaders
            {
                AccessTokenURL = "https://testURL.com",
                ScopeURL = "https://testURL.com",
                ClientSecret = "CSecret",
                ClientID = Guid.NewGuid().ToString(),
                GrantType = "test"
            };
            _configMock.Setup(x => x.GetSection("OAuthSettings:OV:AccessTokenUrl").Value).Returns(header.AccessTokenURL);
            _configMock.Setup(x => x.GetSection("OAuthSettings:OV:ScopeUrl").Value).Returns(header.ScopeURL);
            _configMock.Setup(x => x.GetSection("OAuthSettings:OV:UPADSScopeUrl").Value).Returns("https://testURL.com");
            _configMock.Setup(x => x.GetSection("OAuthSettings:OV:ClientId").Value).Returns(header.ClientID);
            _configMock.Setup(x => x.GetSection("OAuthSettings:OV:ClientSecret").Value).Returns(header.ClientSecret);

            _apiTokenCacheClient = new ApiTokenCacheClient(_configMock.Object, _cacheMock.Object, _applicationLoggerMock.Object, _httpClientFactoryMock.Object);
            string apiName = "TestApiName";
            var res = _apiTokenCacheClient.CreateOAuthTokenFetchHeaders(apiName);

            Assert.NotNull(res);
        }
        [Fact]
        public async Task GetApiCompleteToken_ReturnCompleteToken()
        {
            var header = new OAuthTokenFetchHeaders
            {
                AccessTokenURL = "https://testURL.com",
                ScopeURL = "https://testURL.com",
                ClientSecret = "CSecret",
                ClientID = Guid.NewGuid().ToString(),
                GrantType = "test"
            };
            _configMock.Setup(x => x.GetSection("OAuthSettings:OV:AccessTokenUrl").Value).Returns(header.AccessTokenURL);
            _configMock.Setup(x => x.GetSection("OAuthSettings:OV:ScopeUrl").Value).Returns(header.ScopeURL);
            _configMock.Setup(x => x.GetSection("OAuthSettings:OV:UPADSScopeUrl").Value).Returns("https://testURL.com");
            _configMock.Setup(x => x.GetSection("OAuthSettings:OV:ClientId").Value).Returns(header.ClientID);
            _configMock.Setup(x => x.GetSection("OAuthSettings:OV:ClientSecret").Value).Returns(header.ClientSecret);

            var token = new AccessTokenItem
            {
                Access_token = "Completetoken",
                ExpiresIn = DateTime.UtcNow.AddDays(1),
                Expires_in = 5,
                Ext_expires_in = 5,
                Token_type = "nabc"

            };
            var serializedToken = JsonConvert.SerializeObject(token);
            _httpMessageHandlerMock.Protected()
                .Setup<Task<HttpResponseMessage>>(
                    "SendAsync",
                    ItExpr.IsAny<HttpRequestMessage>(),
                    ItExpr.IsAny<CancellationToken>())
                .ReturnsAsync(new HttpResponseMessage
                {
                    StatusCode = HttpStatusCode.OK,
                    Content = new StringContent(serializedToken)
                });


            var httpClient = new HttpClient(_httpMessageHandlerMock.Object);
            _httpClientFactoryMock.Setup(_ => _.CreateClient(It.IsAny<string>())).Returns(httpClient);

            _apiTokenCacheClient = new ApiTokenCacheClient(_configMock.Object, _cacheMock.Object, _applicationLoggerMock.Object, _httpClientFactoryMock.Object);
            object? outValue = token;

            
            var mockCacheentry = new Mock<ICacheEntry>();
            string apiName = "TestApiName";
            _cacheMock.Setup(x => x.TryGetValue(It.IsAny<string>(), out outValue)).Returns(true);

            _cacheMock.Setup(x => x.CreateEntry(It.IsAny<object>())).Returns(mockCacheentry.Object);
            var res = await _apiTokenCacheClient.GetApiCompleteToken(apiName);

            Assert.NotNull(res);
        }
        [Fact]
        public async Task GetApiCompleteToken_ReturnNewTokenwhen_token_is_null()
        {
            var header = new OAuthTokenFetchHeaders
            {
                AccessTokenURL = "https://testURL.com",
                ScopeURL = "https://testURL.com",
                ClientSecret = "CSecret",
                ClientID = Guid.NewGuid().ToString(),
                GrantType = "test"
            };
            _configMock.Setup(x => x.GetSection("OAuthSettings:OV:AccessTokenUrl").Value).Returns(header.AccessTokenURL);
            _configMock.Setup(x => x.GetSection("OAuthSettings:OV:ScopeUrl").Value).Returns(header.ScopeURL);
            _configMock.Setup(x => x.GetSection("OAuthSettings:OV:UPADSScopeUrl").Value).Returns("https://testURL.com");
            _configMock.Setup(x => x.GetSection("OAuthSettings:OV:ClientId").Value).Returns(header.ClientID);
            _configMock.Setup(x => x.GetSection("OAuthSettings:OV:ClientSecret").Value).Returns(header.ClientSecret);

            var token = new AccessTokenItem
            {
                Access_token = null,
                ExpiresIn = DateTime.UtcNow.AddDays(-1),
                Expires_in = 5,
                Ext_expires_in = 5,
                Token_type = "nabc"

            };
            var serializedToken = JsonConvert.SerializeObject(token);
            _httpMessageHandlerMock.Protected()
                .Setup<Task<HttpResponseMessage>>(
                    "SendAsync",
                    ItExpr.IsAny<HttpRequestMessage>(),
                    ItExpr.IsAny<CancellationToken>())
                .ReturnsAsync(new HttpResponseMessage
                {
                    StatusCode = HttpStatusCode.OK,
                    Content = new StringContent(serializedToken)
                });


            var httpClient = new HttpClient(_httpMessageHandlerMock.Object);
            _httpClientFactoryMock.Setup(_ => _.CreateClient(It.IsAny<string>())).Returns(httpClient);

            _apiTokenCacheClient = new ApiTokenCacheClient(_configMock.Object, _cacheMock.Object, _applicationLoggerMock.Object, _httpClientFactoryMock.Object);
            object? outValue = token;


            var mockCacheentry = new Mock<ICacheEntry>();
            string apiName = "TestApiName";
            _cacheMock.Setup(x => x.TryGetValue(It.IsAny<string>(), out outValue)).Returns(true);

            _cacheMock.Setup(x => x.CreateEntry(It.IsAny<object>())).Returns(mockCacheentry.Object);
            var res = await _apiTokenCacheClient.GetApiCompleteToken(apiName);

            Assert.NotNull(res);
        }
        [Fact]
        public async Task GetOAuthToken_ReturnAuthtokenResult()
        {
            var header = new OAuthTokenFetchHeaders()
            {
                AccessTokenURL = "https://testURL.com",
                ScopeURL = "https://testURL.com",
                ClientSecret = "CSecret",
                ClientID = Guid.NewGuid().ToString(),
                GrantType = "test"
            };
            _configMock.Setup(x => x.GetSection("OAuthSettings:OV:AccessTokenUrl").Value).Returns(header.AccessTokenURL);
            _configMock.Setup(x => x.GetSection("OAuthSettings:OV:ScopeUrl").Value).Returns(header.ScopeURL);
            _configMock.Setup(x => x.GetSection("OAuthSettings:OV:UPADSScopeUrl").Value).Returns("https://testURL.com");
            _configMock.Setup(x => x.GetSection("OAuthSettings:OV:ClientId").Value).Returns(header.ClientID);
            _configMock.Setup(x => x.GetSection("OAuthSettings:OV:ClientSecret").Value).Returns(header.ClientSecret);

            var token = new AccessTokenItem
            {
                Access_token = "token",
                ExpiresIn = DateTime.UtcNow.AddDays(-1),
                Expires_in = 5,
                Ext_expires_in = 5,
                Token_type = "nabc"

            };
            var serializedToken = JsonConvert.SerializeObject(token);
            _httpMessageHandlerMock.Protected()
                .Setup<Task<HttpResponseMessage>>(
                    "SendAsync",
                    ItExpr.IsAny<HttpRequestMessage>(),
                    ItExpr.IsAny<CancellationToken>())
                .ReturnsAsync(new HttpResponseMessage
                {
                    StatusCode = HttpStatusCode.OK,
                    Content = new StringContent(serializedToken)
                });


            var httpClient = new HttpClient(_httpMessageHandlerMock.Object);
            _httpClientFactoryMock.Setup(_ => _.CreateClient(It.IsAny<string>())).Returns(httpClient);

            _apiTokenCacheClient = new ApiTokenCacheClient(_configMock.Object, _cacheMock.Object, _applicationLoggerMock.Object, _httpClientFactoryMock.Object);
            object? outValue = token;


            var mockCacheentry = new Mock<ICacheEntry>();
            string apiName = "TestApiName";
            _cacheMock.Setup(x => x.TryGetValue(It.IsAny<string>(), out outValue)).Returns(true);

            _cacheMock.Setup(x => x.CreateEntry(It.IsAny<object>())).Returns(mockCacheentry.Object);
            var res = await _apiTokenCacheClient.GetOAuthToken(apiName);

            Assert.NotNull(res);
        }
    }
}
