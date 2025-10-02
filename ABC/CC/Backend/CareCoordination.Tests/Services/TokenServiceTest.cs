using AutoMapper;
using CareCoordination.Api.DTOs;
using CareCoordination.Application.Abstracts.DALInterfaces;
using CareCoordination.Application.Abstracts.HandlerInterfaces;
using CareCoordination.Application.Handlers;
using CareCoordination.Application.Models;
using CareCoordination.Domain.Entities;
using CareCoordination.Services.Implementation;
using Microsoft.Extensions.Configuration;
using Moq;
using Xunit;

namespace CareCoordination.Tests.Services
{
    public class TokenServiceTest
    {
        private readonly Mock<ITokenRepository> _tokenRepository;
        private readonly TokenService _tokenService;
        private readonly Mock<IConfiguration> _mockIConfiguration;
        private readonly Mock<IUserManagement> _userManagement;

        public TokenServiceTest()
        {
            _tokenRepository = new Mock<ITokenRepository>();
            _userManagement = new Mock<IUserManagement>();
            _mockIConfiguration = new Mock<IConfiguration>();
            _tokenService = new TokenService(_mockIConfiguration.Object, _tokenRepository.Object,_userManagement.Object);
        }

        [Fact]
        public void GenerateTokenWhenUserIsNull_Test()
        {
            //Arrange
            string userName = "bhushan.patil3";
            string token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJCaHVzaGFuLlBhdGlsMyIsInJvbGUiOiJNRCIsImV4cCI6MTc0MjczOTY1MH0.eUTMRxjXo482CSYP5o8qrcDZb-92Q5a43AXycvtIw5I";
            User user = null;

            //Act
            _userManagement.Setup(tm => tm.ValidateUser(It.IsAny<string>())).Returns(user);
            var result = _tokenService.GenerateToken(userName);

            //Assert
            Assert.Equal(string.Empty,result);
        }

        [Fact]
        public void ValidateRefreshToken_Test()
        {
            //Arrange
            string token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJCaHVzaGFuLlBhdGlsMyIsInJvbGUiOiJNRCIsImV4cCI6MTc0MjczOTY1MH0.eUTMRxjXo482CSYP5o8qrcDZb-92Q5a43AXycvtIw5I";
            TokenResponse response = new TokenResponse()
            {
                Expiration = DateTime.UtcNow,
                RefreshToken = token
            };


            //Act
            _tokenRepository.Setup(tm => tm.GetUserToken(It.IsAny<string>(),It.IsAny<string>())).Returns(response);
            var result = _tokenService.ValidateToken(token);

            //Assert
            Assert.NotEmpty(result);
        }

        [Fact]
        public void RefreshTokens_Test()
        {
            //Arrange
            string userName = "bhushan.patil3";
            string token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJCaHVzaGFuLlBhdGlsMyIsInJvbGUiOiJNRCIsImV4cCI6MTc0MjczOTY1MH0.eUTMRxjXo482CSYP5o8qrcDZb-92Q5a43AXycvtIw5I";
            TokenResponse response = new TokenResponse()
            {
                Expiration = DateTime.UtcNow.AddDays(1),
                RefreshToken = token,
                UserName = userName,
                CreatedDate = DateTime.UtcNow
            };
            TokenDetailsResponse validationRequest = new TokenDetailsResponse()
            {
                AccessToken = token,
                RefreshToken = userName,
            };

            //Act
            _tokenRepository.Setup(tm => tm.GetUserToken(It.IsAny<string>(),It.IsAny<string>())).Returns(response);
            _tokenRepository.Setup(tm => tm.StoreRefreshToken(It.IsAny<string>(),It.IsAny<string>()));
            var res = _tokenService.RefreshTokens(userName,token);
            //Assert
            Assert.NotEmpty(res.RefreshToken);
        }

        [Fact]
        public void GetUserToken_Test()
        {
            //Arrange
            string userName = "bhushan.patil3";
            string token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJCaHVzaGFuLlBhdGlsMyIsInJvbGUiOiJNRCIsImV4cCI6MTc0MjczOTY1MH0.eUTMRxjXo482CSYP5o8qrcDZb-92Q5a43AXycvtIw5I";
            TokenResponse response = new TokenResponse()
            {
                RefreshToken = token
            };

            //Act
            _tokenRepository.Setup(tm => tm.GetUserToken(It.IsAny<string>(),It.IsAny<string>())).Returns(response);
            var result = _tokenService.GetUserToken(userName,token);

            //Assert
            Assert.Equal(token,result.RefreshToken);
        }

        [Fact]
        public void RefreshTokens_Throws_Exception()
        {
            //Act 
            Assert.ThrowsAny<Exception>(() => _tokenService.RefreshTokens(null, null));
        }

        [Fact]
        public void GenerateToken_UserNotFound_ReturnsEmptyString()
        {
            // Arrange
            var userName = "invalidUser";
            _userManagement.Setup(um => um.ValidateUser(userName)).Returns((User)null);

            // Act
            var result = _tokenService.GenerateToken(userName);

            // Assert
            Assert.Equal(string.Empty,result);
        }

        [Fact]
        public void GenerateToken_UserFound_ReturnsToken()
        {
            // Arrange
            var userName = "validUser";
            var user = new User { Username = userName,Role = "Admin",
                HasLEA = false,
                Permissions = []
            };
            _userManagement.Setup(um => um.ValidateUser(userName)).Returns(user);
            _mockIConfiguration.Setup(c => c["JwtSettings:SecretKey"]).Returns("5120fe21aa6d497c99f4b7dccf551001");
            _mockIConfiguration.Setup(c => c["JwtSettings:AccessToknExpirationMinutes"]).Returns("1");

            // Act
            var result = _tokenService.GenerateToken(userName);

            // Assert
            Assert.NotEqual(string.Empty,result);
        }
    }
}
