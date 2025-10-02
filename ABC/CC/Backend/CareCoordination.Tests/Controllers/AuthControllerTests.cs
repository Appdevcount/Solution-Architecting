using CareCoordination.Api.Controllers;
using CareCoordination.Api.DTOs;
using CareCoordination.Application.Abstracts.HandlerInterfaces;
using CareCoordination.Application.Logger;
using CareCoordination.Application.Models;
using CareCoordination.Domain.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Moq;
using System.Net;
using System.Security.Claims;
using Xunit;

namespace CareCoordination.Tests.Controllers
{
    public class AuthControllerTests
    {
        private readonly Mock<ITokenManagement> _tokenManagementMock;
        private readonly Mock<IUserManagement> _userManagementMock;
        private readonly Mock<IConfiguration> _configurationMock;
        private readonly AuthController _authController;
        private readonly Mock<IApplicationLogger> _loggerMock;

        public AuthControllerTests()
        {
            _tokenManagementMock = new Mock<ITokenManagement>();
            _userManagementMock = new Mock<IUserManagement>();
            _configurationMock = new Mock<IConfiguration>();
            _loggerMock = new Mock<IApplicationLogger>();
            _authController = new AuthController(_loggerMock.Object, _tokenManagementMock.Object,_userManagementMock.Object,_configurationMock.Object);
        }

        [Fact]
        public void GenerateToken_ReturnsUnauthorized_WhenApiKeyIsMissing()
        {
            // Arrange
            var request = new TokenRequest { Username = "user1" };
            var httpContext = new DefaultHttpContext();
            _authController.ControllerContext = new ControllerContext
            {
                HttpContext = httpContext
            };
            // Act
            var result = _authController.GenerateToken(request);

            // Assert
            var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(result);
            Assert.Equal(401, unauthorizedResult.StatusCode);
            Assert.Equal("API key is missing.", unauthorizedResult.Value);
        }

        [Fact]
        public void GenerateToken_ReturnsUnauthorized_WhenApiKeyIsInvalid()
        {
            // Arrange
            var request = new TokenRequest { Username = "user1" };
            _configurationMock.Setup(config => config["ApiKey"]).Returns("ValidApiKey");
            _authController.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
            };
            _authController.Request.Headers.Add("ApiKey", "InvalidApiKey");

            // Act
            var result = _authController.GenerateToken(request);

            // Assert
            var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(result);
            Assert.Equal(401, unauthorizedResult.StatusCode);
        }

        [Fact]
        public void GenerateToken_ReturnsUnauthorized_WhenUsernameIsInvalid()
        {
            // Arrange
            var request = new TokenRequest { Username = "invalidUser" };
            //var apiKey = _configurationMock.Object["ApiKey"];
            _configurationMock.Setup(config => config["ApiKey"]).Returns("ValidApiKey");
            _authController.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
            };
            _authController.Request.Headers.Add("ApiKey", "ValidApiKey");
            _userManagementMock.Setup(um => um.ValidateUser(It.IsAny<string>())).Returns((User)null);

            // Act
            var result = _authController.GenerateToken(request);

            // Assert
            var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(result);
            Assert.Equal(401, unauthorizedResult.StatusCode);
        }
        
        [Fact]
        public async Task RefreshTokens_ReturnsBadRequest_WhenRequestIsInvalid()
        {
            // Act
            var result = _authController.RefreshTokens(null);

            // Assert
            Assert.NotNull(result.Result);
        }

        [Fact]
        public async Task RefreshTokens_ReturnsUnauthorized_WhenRefreshTokenIsInvalid()
        {
            // Arrange
            var request = new RefreshTokenRequest { RefreshToken = "null", UserName = "user1" };

            TokenDetailsResponse tokenValidationRequest = new TokenDetailsResponse()
            {
                AccessToken = null
            };
            _tokenManagementMock.Setup(tm => tm.RefreshTokens(It.IsAny<string>(), It.IsAny<string>())).Returns(tokenValidationRequest);

            // Act
            var result = _authController.RefreshTokens(request);

            // Assert
            Assert.NotNull(result.Result);
        }

        [Fact]
        public async Task RefreshTokens_ReturnsOk_WhenTokenIsRefreshed()
        {
            // Arrange
            var request = new RefreshTokenRequest { RefreshToken = "validToken", UserName = "user1" };
            TokenDetailsResponse tokenValidationRequest = new TokenDetailsResponse()
            {
                AccessToken = "asdfghjkl"
            };
            _tokenManagementMock.Setup(tm => tm.RefreshTokens(It.IsAny<string>(), It.IsAny<string>())).Returns(tokenValidationRequest);

            // Act
            var result = _authController.RefreshTokens(request);

            // Assert
            Assert.NotNull(result.Result);
        }
        [Fact]
        public void GetUserDetails_ReturnsInternalServerError_WhenExceptionOccurs()
        {
            // Arrange
            _userManagementMock.Setup(um => um.ValidateUser(It.IsAny<string>())).Throws(new Exception("Internal error"));

            // Act
            var result = _authController.GetUserDetails();

            // Assert
            var statusCodeResult = Assert.IsType<ObjectResult>(result);
            Assert.Equal((int)HttpStatusCode.InternalServerError, statusCodeResult.StatusCode);
        }

        [Fact]
        public void GetUserDetails_ReturnsOk_WhenUserIsAuthenticated()
        {
            // Arrange
            var user = new User { Username = "user1" };
            _userManagementMock.Setup(um => um.ValidateUser(It.IsAny<string>())).Returns(user);
            var claims = new List<Claim> { new Claim(ClaimTypes.NameIdentifier, "user1") };
            var identity = new ClaimsIdentity(claims, "mock");
            var principal = new ClaimsPrincipal(identity);
            _authController.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext() { User = principal }
            };

            // Act
            var result = _authController.GetUserDetails();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(user, okResult.Value);
        }

        [Fact]
        public void GenerateToken_MissingApiKey_ReturnsUnauthorized()
        {
            // Arrange
            var request = new TokenRequest { Username = "testuser" };
            _authController.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
            };

            // Act
            var result = _authController.GenerateToken(request);

            // Assert
            var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(result);
            Assert.Equal("API key is missing.",unauthorizedResult.Value);
        }

        [Fact]
        public void GenerateToken_InvalidRequest_ReturnsBadRequest()
        {
            //Arrange
            TokenRequest request = null;
            _authController.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
            };
            _authController.HttpContext.Request.Headers["X-API-Key"] = "MyAPIKey7347627";

            // Act
            var result = _authController.GenerateToken(request);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.NotNull(badRequestResult);
        }

        [Fact]
        public void GenerateToken_InvalidApiKey_ReturnsUnauthorized()
        {
            // Arrange
            var request = new TokenRequest { Username = "testuser" };
            _authController.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
            };
            _authController.HttpContext.Request.Headers["X-API-Key"] = "MyAPIKey7347627";

            var mockSection = new Mock<IConfigurationSection>();
            mockSection.Setup(x => x.Value).Returns("AAA");
            _configurationMock.Setup(x => x.GetSection("ApiKey")).Returns(mockSection.Object);

            // Act
            var result = _authController.GenerateToken(request);

            // Assert
            var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(result);
            Assert.Equal("Invalid Api Key",unauthorizedResult.Value);
        }

        [Fact]
        public void GenerateToken_InvalidUsername_ReturnsUnauthorized()
        {
            // Arrange
            var request = new TokenRequest { Username = "invaliduser" };
            _authController.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
            };
            _authController.HttpContext.Request.Headers["X-API-Key"] = "MyAPIKey7347627";

            var mockSection = new Mock<IConfigurationSection>();
            mockSection.Setup(x => x.Value).Returns("MyAPIKey7347627");
            _configurationMock.Setup(x => x.GetSection("ApiKey")).Returns(mockSection.Object);

            _userManagementMock.Setup(um => um.ValidateUser(request.Username)).Returns((User)null);

            // Act
            var result = _authController.GenerateToken(request);

            // Assert
            var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(result);
            Assert.NotNull(unauthorizedResult);
        }

        [Fact]
        public void GenerateToken_ValidRequest_ReturnsOk()
        {
            // Arrange
            var request = new TokenRequest { Username = "validuser" };
            var tokenResponse = new TokenResponse { RefreshToken = "generatedToken" };
            _authController.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
            };
            _authController.HttpContext.Request.Headers["X-API-Key"] = "MyAPIKey7347627";
            var mockSection = new Mock<IConfigurationSection>();
            mockSection.Setup(x => x.Value).Returns("MyAPIKey7347627");
            _configurationMock.Setup(x => x.GetSection("ApiKey")).Returns(mockSection.Object);
            _userManagementMock.Setup(um => um.ValidateUser(request.Username)).Returns(new User());
            _tokenManagementMock.Setup(tm => tm.GenerateToken(request.Username)).Returns(tokenResponse.RefreshToken);

            // Act
            var result = _authController.GenerateToken(request);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(tokenResponse.RefreshToken,okResult.Value);
        }

        [Fact]
        public void GetUserDetails_UserNotAuthenticated_ReturnsOkWithEmptyUser()
        {
            // Arrange
            var user = new ClaimsPrincipal(new ClaimsIdentity());
            _authController.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = user }
            };

            _userManagementMock.Setup(um => um.ValidateUser(It.IsAny<string>())).Returns(new User());

            // Act
            var result = _authController.GetUserDetails();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var response = Assert.IsType<User>(okResult.Value);
            Assert.NotNull(response);
        }

        [Fact]
        public void GetUserDetails_UserAuthenticated_ReturnsOkWithUserDetails()
        {
            // Arrange
            var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, "testuser")
        };
            var identity = new ClaimsIdentity(claims,"TestAuthType");
            var user = new ClaimsPrincipal(identity);
            _authController.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = user }
            };

            var expectedUser = new User { Username = "testuser" };
            _userManagementMock.Setup(um => um.ValidateUser("testuser")).Returns(expectedUser);

            // Act
            var result = _authController.GetUserDetails();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var response = Assert.IsType<User>(okResult.Value);
            Assert.Equal(expectedUser,response);
        }

        [Fact]
        public void GetUserDetails_ExceptionThrown_ReturnsInternalServerError()
        {
            // Arrange
            var user = new ClaimsPrincipal(new ClaimsIdentity());
            _authController.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = user }
            };

            _userManagementMock.Setup(um => um.ValidateUser(It.IsAny<string>())).Throws(new Exception("Test exception"));

            // Act
            var result = _authController.GetUserDetails();

            // Assert
            var statusCodeResult = Assert.IsType<ObjectResult>(result);
            Assert.Equal((int)HttpStatusCode.InternalServerError,statusCodeResult.StatusCode);
            Assert.Equal("Test exception",statusCodeResult.Value);
        }

        [Fact]
        public async Task ValidateToken_ReturnsOkResult_WithValidToken()
        {
            // Arrange
            var validToken = "your_valid_token";
            var tokenResponse = "asdfghj";
            _tokenManagementMock.Setup(tm => tm.ValidateToken(validToken)).Returns(tokenResponse);

            _authController.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
            };
            _authController.HttpContext.Request.Headers["Authorization"] = $"Bearer {validToken}";

            // Act
            var result = _authController.ValidateToken();

            // Assert
            Assert.NotNull(result.Result);
        }
    }
}
