using AutoMapper;
using CareCoordination.Api.Controllers;
using CareCoordination.Api.DTOs;
using CareCoordination.Application.Abstracts.HandlerInterfaces;
using CareCoordination.Application.Logger;
using CareCoordination.Application.Models;
using Castle.Core.Logging;
using Jose;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Moq;
using System;
using System.Collections.Generic;
using System.IdentityModel.Claims;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace CareCoordination.Tests.Controllers
{
    public class RequestViewControllerTest
    {
        private readonly Mock<IApplicationLogger> _loggerMock;
        private readonly Mock<IMapper> _mapperMock;
        private readonly Mock<IRequestViewLookupManagement> _reqViewLookupManagementMock;
        private readonly RequestViewController _controller;

        public RequestViewControllerTest()
        {
            _loggerMock = new Mock<IApplicationLogger>();
            _mapperMock = new Mock<IMapper>();
            _reqViewLookupManagementMock = new Mock<IRequestViewLookupManagement>();
            _controller = new RequestViewController(_loggerMock.Object, _mapperMock.Object, _reqViewLookupManagementMock.Object);
        }
        [Fact]
        public void Constructor_creates_instance()
        {
            Assert.IsAssignableFrom<RequestViewController>(new RequestViewController(_loggerMock.Object, _mapperMock.Object, _reqViewLookupManagementMock.Object));
        }

        [Fact]
        public async Task GetProcedureCodes_ReturnsBadRequest_WhenRequestIsInvalid()
        {
            // Arrange
            var request = new ProcedureCodeSearchRequest
            {
                InsCarrier = "",
                CompanyID = 0,
                ProcedureCodeIDorDesc = ""
            };



            // Act
            var result = await _controller.GetProcedureCodes(request) as BadRequestObjectResult;




            // Assert
            Assert.NotNull(result);
            Assert.Equal(StatusCodes.Status400BadRequest, result.StatusCode);
            var response = result.Value as ProcedureCodeSearchResponseModel;
            Assert.False(response!.IsSuccess);
        }
        [Fact]
        public async Task GetProcedureCodes_ReturnsOk_WhenRequestIsValid()
        {
            // Arrange
            var request = new ProcedureCodeSearchRequest
            {
                InsCarrier = "Cigna",
                CompanyID = 8,
                ProcedureCodeIDorDesc = "95"
            };

            var responseModel = new ProcedureCodeSearchResponseModel { IsSuccess = true };
            _mapperMock.Setup(m => m.Map<ProcedureCodeSearchRequestModel>(It.IsAny<ProcedureCodeSearchRequest>()))
                       .Returns(new ProcedureCodeSearchRequestModel());
            _reqViewLookupManagementMock.Setup(r => r.GetProcedureCodes(It.IsAny<ProcedureCodeSearchRequestModel>()))
                                        .ReturnsAsync(responseModel);

            // Act
            var result = await _controller.GetProcedureCodes(request) as OkObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(StatusCodes.Status200OK, result.StatusCode);
            var response = result.Value as ProcedureCodeSearchResponseModel;
            Assert.True(response!.IsSuccess);
        }
        [Fact]
        public async Task GetProcedureCodes_CatchBlock_ReturnsInternalServerError()
        {
            // Arrange
            var request = new ProcedureCodeSearchRequest
            {
                InsCarrier = "InsCarrier",
                CompanyID = 1,
                ProcedureCodeIDorDesc = "CodeDesc"
            };

            _mapperMock.Setup(m => m.Map<ProcedureCodeSearchRequestModel>(It.IsAny<ProcedureCodeSearchRequest>()))
                       .Throws(new Exception("Mapping error"));

            // Act
            var result = await _controller.GetProcedureCodes(request) as ObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(StatusCodes.Status500InternalServerError, result.StatusCode);
            var response = result.Value as ProcedureCodeSearchResponseModel;
            Assert.False(response!.IsSuccess);
            Assert.Equal("Mapping error", response.Error);
        }


        [Fact]
        public async Task AddProcedureCode_ReturnsBadRequest_WhenRequestIsInvalid()
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
            var request = new ProcedureCodeAddOrRemoveRequest
            {
                UserId = "test-user",
                EpisodeID = "",
                ProcedureCode = "",
                ProcedureDesc = "",
                PrivateDutyNurse = null,
                CustomNeed = null
            };

            var context = new DefaultHttpContext();
            context.Request.Headers["Authorization"] = $"Bearer {jwt}";

            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = context
            };


            // Act
            var result = await _controller.AddProcedureCode(request) as BadRequestObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(StatusCodes.Status400BadRequest, result.StatusCode);
            var response = result.Value as ProcedureCodeAddOrRemoveResponseModel;
            Assert.False(response!.IsSuccess);
        }

        [Fact]
        public async Task AddProcedureCode_ReturnsOk_WhenRequestIsValid()
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
            var request = new ProcedureCodeAddOrRemoveRequest
            {
                UserId = "test-user",
                EpisodeID = "CC000000026",
                ProcedureCode = "95782",
                ProcedureDesc = "Polysomnography",
                PrivateDutyNurse = true,
                CustomNeed = true
            };

            var context = new DefaultHttpContext();
            context.Request.Headers["Authorization"] = $"Bearer {jwt}";

            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = context
            };

            var responseModel = new ProcedureCodeAddOrRemoveResponseModel { IsSuccess = true, Error = null };
            _mapperMock.Setup(m => m.Map<ProcedureCodeAddOrRemoveRequestModel>(It.IsAny<ProcedureCodeAddOrRemoveRequest>()))
                       .Returns(new ProcedureCodeAddOrRemoveRequestModel());
            _reqViewLookupManagementMock.Setup(r => r.AddProcedureCode(It.IsAny<ProcedureCodeAddOrRemoveRequestModel>()))
                                        .ReturnsAsync(responseModel);

            // Act
            var result = await _controller.AddProcedureCode(request) as OkObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(StatusCodes.Status200OK, result.StatusCode);
            var response = result.Value as ProcedureCodeAddOrRemoveResponseModel;
            Assert.True(response!.IsSuccess);
        }

        [Fact]
        public async Task AddProcedureCode_CatchBlock_ReturnsInternalServerError()
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
            
            var request = new ProcedureCodeAddOrRemoveRequest
            {
                UserId = "test-user",
                EpisodeID = "EpisodeID",
                ProcedureCode = "ProcedureCode",
                ProcedureDesc = "ProcedureDesc",
                PrivateDutyNurse = null,
                CustomNeed = true
            };

            _mapperMock.Setup(m => m.Map<ProcedureCodeAddOrRemoveRequestModel>(It.IsAny<ProcedureCodeAddOrRemoveRequest>()))
                       .Throws(new Exception("Mapping error"));

            var context = new DefaultHttpContext();
            context.Request.Headers["Authorization"] = $"Bearer {jwt}";

            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = context
            };

            // Act
            var result = await _controller.AddProcedureCode(request) as ObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(StatusCodes.Status500InternalServerError, result.StatusCode);
            var response = result.Value as ProcedureCodeAddOrRemoveResponseModel;
            Assert.NotNull(response);
            Assert.False(response!.IsSuccess);
            Assert.Equal("Mapping error", response.Error);
        }


        [Fact]
        public async Task RemoveProcedureCode_ReturnsBadRequest_WhenRequestIsInvalid()
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
            var request = new ProcedureCodeAddOrRemoveRequest
            {
                UserId = "test-user",
                EpisodeID = "",
                ProcedureCode = "",
                ProcedureDesc = "",
                PrivateDutyNurse = null,
                CustomNeed = null
            };

            var context = new DefaultHttpContext();
            context.Request.Headers["Authorization"] = $"Bearer {jwt}";

            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = context
            };

            // Act
            var result = await _controller.RemoveProcedureCode(request) as BadRequestObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(StatusCodes.Status400BadRequest, result.StatusCode);
            var response = result.Value as ProcedureCodeAddOrRemoveResponseModel;
            Assert.False(response!.IsSuccess);
        }

        [Fact]
        public async Task RemoveProcedureCode_ReturnsOk_WhenRequestIsValid()
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
            var request = new ProcedureCodeAddOrRemoveRequest
            {
                UserId = "test-user",
                EpisodeID = "CC000000026",
                ProcedureCode = "95782",
                ProcedureDesc = "Polysomnography",
                PrivateDutyNurse = true,
                CustomNeed = true
            };

            var context = new DefaultHttpContext();
            context.Request.Headers["Authorization"] = $"Bearer {jwt}";

            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = context
            };

            var responseModel = new ProcedureCodeAddOrRemoveResponseModel { IsSuccess = true, Error = null };
            _mapperMock.Setup(m => m.Map<ProcedureCodeAddOrRemoveRequestModel>(It.IsAny<ProcedureCodeAddOrRemoveRequest>()))
                       .Returns(new ProcedureCodeAddOrRemoveRequestModel());
            _reqViewLookupManagementMock.Setup(r => r.RemoveProcedureCode(It.IsAny<ProcedureCodeAddOrRemoveRequestModel>()));
         

            // Act
            var result = await _controller.RemoveProcedureCode(request) as OkObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(StatusCodes.Status200OK, result.StatusCode);
            //var response = result.Value as ProcedureCodeAddOrRemoveResponseModel;
            //Assert.True(response!.IsSuccess);
        }

        [Fact]
        public async Task RemoveProcedureCode_CatchBlock_ReturnsInternalServerError()
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

            var request = new ProcedureCodeAddOrRemoveRequest
            {
               
                EpisodeID = "EpisodeID",
                ProcedureCode = "ProcedureCode",
                ProcedureDesc = "ProcedureDesc",
                PrivateDutyNurse = true,
                CustomNeed = false
            };

            _mapperMock.Setup(m => m.Map<ProcedureCodeAddOrRemoveRequestModel>(It.IsAny<ProcedureCodeAddOrRemoveRequest>()))
                       .Throws(new Exception("Mapping error"));

            var context = new DefaultHttpContext();
            context.Request.Headers["Authorization"] = $"Bearer {jwt}";

            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = context
            };

            // Act
            var result = await _controller.RemoveProcedureCode(request) as ObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(StatusCodes.Status500InternalServerError, result.StatusCode);
            var response = result.Value as ProcedureCodeAddOrRemoveResponseModel;
            Assert.NotNull(response);
            Assert.False(response!.IsSuccess);
            Assert.Equal("Mapping error", response.Error);
        }
    }
}





