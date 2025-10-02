using CareCoordination.Api.DTOs;
using CareCoordination.Application.Abstracts.ServiceInterfaces;
using CareCoordination.Application.Handlers;
using CareCoordination.Application.Models;
using Moq;
using Xunit;

namespace CareCoordination.Tests.ApplictaionHandlers
{
    public class TokenManagementTest
    {
        private readonly Mock<ITokenService> _tokenService;
        private readonly TokenManagement _tokenManagement;

        public TokenManagementTest()
        {
            _tokenService = new Mock<ITokenService>();
            _tokenManagement = new TokenManagement(_tokenService.Object);
        }

        [Fact]
        public void GenerateToken_Test()
        {
            //Arrange
            string userName = "bhushan.patil3";
            string token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJCaHVzaGFuLlBhdGlsMyIsInJvbGUiOiJNRCIsImV4cCI6MTc0MjczOTY1MH0.eUTMRxjXo482CSYP5o8qrcDZb-92Q5a43AXycvtIw5I";
            
            //Act
            _tokenService.Setup(tm => tm.GenerateToken(It.IsAny<string>())).Returns(token);
            var result = _tokenManagement.GenerateToken(userName);

            //Assert
            Assert.Equal(token,result);
        }

        [Fact]
        public void ValidateRefreshToken_Test()
        {
            //Arrange
            string userName = "bhushan.patil3";
            string token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJCaHVzaGFuLlBhdGlsMyIsInJvbGUiOiJNRCIsImV4cCI6MTc0MjczOTY1MH0.eUTMRxjXo482CSYP5o8qrcDZb-92Q5a43AXycvtIw5I";

            //Act
            _tokenService.Setup(tm => tm.ValidateToken(It.IsAny<string>())).Returns("asdfghj");
            var result = _tokenManagement.ValidateToken(token);

            //Assert
            Assert.NotEmpty(result);
        }

        [Fact]
        public void RefreshTokensn_Test()
        {
            //Arrange
            string userName = "bhushan.patil3";
            string token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJCaHVzaGFuLlBhdGlsMyIsInJvbGUiOiJNRCIsImV4cCI6MTc0MjczOTY1MH0.eUTMRxjXo482CSYP5o8qrcDZb-92Q5a43AXycvtIw5I";
            TokenDetailsResponse validationRequest = new TokenDetailsResponse()
            {
                RefreshToken = userName,
                AccessToken = token
            };

            //Act
            _tokenService.Setup(tm => tm.RefreshTokens(It.IsAny<string>(),It.IsAny<string>())).Returns(validationRequest);
            var result = _tokenManagement.RefreshTokens(userName,token);

            //Assert
            Assert.Equal(userName, result.RefreshToken);
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
            _tokenService.Setup(tm => tm.GetUserToken(It.IsAny<string>(),It.IsAny<string>())).Returns(response);
            var result = _tokenManagement.GetUserToken(userName,token);

            //Assert
            Assert.Equal(token, result.RefreshToken);
        }
    }
}
