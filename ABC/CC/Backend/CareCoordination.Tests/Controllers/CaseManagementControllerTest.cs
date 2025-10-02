using AutoMapper;
using CareCoordination.Api.Controllers;
using CareCoordination.Api.DTOs;
using CareCoordination.Application.Abstracts.DALInterfaces;
using CareCoordination.Application.Abstracts.HandlerInterfaces;
using CareCoordination.Application.Handlers;
using CareCoordination.Application.Logger;
using CareCoordination.Application.Models;
using CareCoordination.Domain.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Moq;
using System.IdentityModel.Tokens.Jwt;
using System.Reflection;
using System.Text;
using Xunit;

namespace CareCoordination.Tests.Controllers
{
    public class CaseManagementControllerTest
    {
        private readonly Mock<IApplicationLogger> _logger;
        private readonly Mock<IRequestManagement> _mockRequestManagment;
        private readonly RequestCaseManagement _service;
        private readonly Mock<IMapper> _mapper;
        private readonly CaseManagementController _controller;
        private readonly Mock<ICaseManagement> _mockrequestCaseManagement;

        public CaseManagementControllerTest()
        {
            //Arrange
            _mockRequestManagment = new Mock<IRequestManagement>();
            _service = new RequestCaseManagement(_mockRequestManagment.Object);
            _logger = new Mock<IApplicationLogger>();
            _mapper = new Mock<IMapper>();
            _mockrequestCaseManagement = new Mock<ICaseManagement>();
            _controller = new CaseManagementController(_logger.Object, _mapper.Object, _mockrequestCaseManagement.Object);
        }

        [Fact]
        public void Constructor_creates_instance()
        {
            Assert.IsAssignableFrom<CaseManagementController>(new CaseManagementController(_logger.Object, _mapper.Object, _mockrequestCaseManagement.Object));
        }

        [Fact]
        public async Task UpdateMissedStartOfCare_calls_return200()
        {
            //Arrange
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
            context.Request.Headers["Authorization"] = $"Bearer {jwt}";

            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = context
            };
            var request = MockCaseManagement();
            var model = new CaseManagementModel();
            _mapper.Setup(m => m.Map<CaseManagementModel>(request)).Returns(new CaseManagementModel 
            {
                UserId = "CC_User",
                RequestId = "C1",
                CaseStatus = "Close",
                IsEscalated = true,
                FollowUPDate = DateTime.UtcNow,
                FollowUPNote = "Note",
                Notes = "Test",
                CreatedDate = DateTime.UtcNow,
                FirstName = "Test",
                LastName = "Test",
                PhoneNumber = "9848574574",
                Extension = "98734",
                Email = "Test@evicore.com",
                MissedStartOfCare = true,
                MissedStartOfCareReason = "Test" ,
                RequestType = "MSOC",
                DateOfService = DateTime.UtcNow,
                CloseReason = "Test"
            });
            _mockrequestCaseManagement.Setup(cm => cm.UpdateMissedStartOfCareAsync(model))
                .ReturnsAsync(new CaseManagementResponseModel 
                { 
                    IsSuccess = true,
                    CaseStatus = "Close",
                    IsEscalated = true,
                    FollowUPDate = DateTime.UtcNow,
                    FollowUPNote = "Note",
                    Notes = "Test",
                    CreatedDate = DateTime.UtcNow,
                    FirstName = "Test",
                    LastName = "Test",
                    PhoneNumber = "9848574574",
                    Extension = "98734",
                    Email = "Test@evicore.com",
                    MissedStartOfCare = false,
                    MissedStartOfCareReason = string.Empty,
                    RequestType = "MSOC",
                    DateOfService = DateTime.UtcNow,
                    CloseReason = "Test"
                });
            _mapper.Setup(m => m.Map<CaseManagementEntity>(It.IsAny<CaseManagement>()))
                .Returns(MockCaseManagementEntity);
            _mockRequestManagment.Setup(r => r.UpdateMissedStartOfCareAsync(model))
                .ReturnsAsync(new CaseManagementResponseModel 
                {
                    RequestId = "c1",
                    IsSuccess = true,
                    MissedStartOfCare = true,
                    MissedStartOfCareReason = "Test",
                    CaseStatus = "Close",
                    IsEscalated = true,
                    FollowUPDate = DateTime.UtcNow,
                    FollowUPNote = "Note",
                    Notes = "Test",
                    CreatedDate = DateTime.UtcNow,
                    FirstName = "Test",
                    LastName = "Test",
                    PhoneNumber = "9848574574",
                    Extension = "98734",
                    Email = "Test@evicore.com",
                    CareCoordinationEpisodeDate = "01091998",
                    RequestType = "MSOC",
                    DateOfService = DateTime.UtcNow,
                    CloseReason = "Test"
                });
            await _service.UpdateMissedStartOfCareAsync(model);
            //Act
            var result = await _controller.UpdateMissedStartOfCareAsync(request);
            //Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(200, okResult.StatusCode);
        }
        [Fact]
        public async Task UpdateMissedStartOfCare_calls_return200_WhenMissedSOCReasonIsFalse()
        {
            //Arrange

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
            context.Request.Headers["Authorization"] = $"Bearer {jwt}";

            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = context
            };

            var request = new CaseManagement()
            {
                RequestId = "C1",
                MissedStartOfCare = true,
                MissedStartOfCareReason = "",
                CaseStatus = "Close",
                IsEscalated = true,
                FollowUPDate = DateTime.UtcNow,
                FollowUPNote = "Note",
                Notes = "Test",
                CreatedBy = "Test",
                CreatedDate = DateTime.UtcNow,
                FirstName = "Test",
                LastName = "Test",
                PhoneNumber = "9848574574",
                Extension = "98734",
                Email = "Test@evicore.com",
                RequestType = "MSOC",
                DateOfService = DateTime.UtcNow,
                CloseReason = "Test",
            };
            var model = new CaseManagementModel();
            _mapper.Setup(m => m.Map<CaseManagementModel>(request)).Returns(new CaseManagementModel 
            {
                RequestId = "C1",
                CaseStatus = "Close",
                IsEscalated = true,
                FollowUPDate = DateTime.UtcNow,
                FollowUPNote = "Note",
                Notes = "Test",
                CreatedDate = DateTime.UtcNow,
                FirstName = "Test",
                LastName = "Test",
                PhoneNumber = "9848574574",
                Extension = "98734",
                Email = "Test@evicore.com",
                MissedStartOfCare = true,
                MissedStartOfCareReason = "" ,
                RequestType = "MSOC",
                DateOfService = DateTime.UtcNow,
                CloseReason = "Test"
            });
            _mockrequestCaseManagement.Setup(cm => cm.UpdateMissedStartOfCareAsync(model))
                .ReturnsAsync(new CaseManagementResponseModel 
                { 
                    IsSuccess = true ,
                    RequestId = "C1",
                    CaseStatus = "Close",
                    IsEscalated = true,
                    FollowUPDate = DateTime.UtcNow,
                    FollowUPNote = "Note",
                    Notes = "Test",
                    CreatedDate = DateTime.UtcNow,
                    FirstName = "Test",
                    LastName = "Test",
                    PhoneNumber = "9848574574",
                    Extension = "98734",
                    Email = "Test@evicore.com",
                    MissedStartOfCare = true,
                    MissedStartOfCareReason = "",
                    CareCoordinationEpisodeDate = "01091998",
                    Error = null,
                    RequestType = "MSOC",
                    DateOfService = DateTime.UtcNow,
                    CloseReason = "Test"
                });
            _mapper.Setup(m => m.Map<CaseManagementEntity>(It.IsAny<CaseManagement>()))
                .Returns(MockCaseManagementEntity);
            _mockRequestManagment.Setup(r => r.UpdateMissedStartOfCareAsync(model))
                .ReturnsAsync(new CaseManagementResponseModel 
                { 
                    RequestId = "c1",
                    IsSuccess = true,
                    MissedStartOfCare = true,
                    MissedStartOfCareReason = "" ,
                    CaseStatus = "Close",
                    IsEscalated = true,
                    FollowUPDate = DateTime.UtcNow,
                    FollowUPNote = "Note",
                    Notes = "Test",
                    CreatedDate = DateTime.UtcNow,
                    FirstName = "Test",
                    LastName = "Test",
                    PhoneNumber = "9848574574",
                    Extension = "98734",
                    Email = "Test@evicore.com",
                    CareCoordinationEpisodeDate = "01091998",
                    Error = null,
                    RequestType = "MSOC",
                    DateOfService = DateTime.UtcNow,
                    CloseReason = "Test"
                });
            await _service.UpdateMissedStartOfCareAsync(model);
            //Act
            var result = await _controller.UpdateMissedStartOfCareAsync(request);
            //Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(200, okResult.StatusCode);
        }

        [Fact]
        public async Task UpdateMissedStartOfCareAsync_ShouldReturnBadRequet_WhenRequestFails()
        {
            //Arrange

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
            context.Request.Headers["Authorization"] = $"Bearer {jwt}";

            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = context
            };

            _mapper.Setup(m => m.Map<CaseManagementEntity>(It.IsAny<CaseManagement>()))
                .Returns(new CaseManagementEntity()
                {
                    RequestId = string.Empty,
                    CaseStatus = "Close",
                    IsEscalated = true,
                    FollowUPDate = DateTime.UtcNow,
                    FollowUPNote = "Note",
                    Notes = "Test",
                    CreatedDate = DateTime.UtcNow,
                    FirstName = "Test",
                    LastName = "Test",
                    PhoneNumber = "9848574574",
                    Extension = "98734",
                    Email = "Test@evicore.com",
                    MissedStartOfCare = true,
                    MissedStartOfCareReason = "",
                    CreatedBy = "",
                    RequestType = "MSOC",
                    DateOfService = DateTime.UtcNow,
                    CloseReason = "Test"
                });
            //Act
            var result = await _controller.UpdateMissedStartOfCareAsync(new CaseManagement() 
            { 
                RequestId = string.Empty,
                CaseStatus = "Close",
                IsEscalated = true,
                FollowUPDate = DateTime.UtcNow,
                FollowUPNote = "Note",
                Notes = "Test",
                CreatedDate = DateTime.UtcNow,
                FirstName = "Test",
                LastName = "Test",
                PhoneNumber = "9848574574",
                Extension = "98734",
                Email = "Test@evicore.com",
                CreatedBy ="",
                MissedStartOfCare = false,
                MissedStartOfCareReason = string.Empty,
                RequestType = "MSOC",
                DateOfService = DateTime.UtcNow,
                CloseReason = "Test",
            });
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Contains("Request ID cannot be empty", badRequestResult?.Value?.ToString());

            _mapper.Setup(m => m.Map<CaseManagementEntity>(It.IsAny<CaseManagement>()))
                .Returns(new CaseManagementEntity() 
                { 
                    RequestId = "C1",
                    MissedStartOfCare = null ,
                    CaseStatus = "Close",
                    IsEscalated = true,
                    FollowUPDate = DateTime.UtcNow,
                    FollowUPNote = "Note",
                    Notes = "Test",
                    CreatedDate = DateTime.UtcNow,
                    FirstName = "Test",
                    LastName = "Test",
                    PhoneNumber = "9848574574",
                    Extension = "98734",
                    Email = "Test@evicore.com",
                    MissedStartOfCareReason = "",
                    CreatedBy = "test",
                    RequestType = "MSOC",
                    DateOfService = DateTime.UtcNow,
                    CloseReason = "Test"
                });
            var resultMSOC = await _controller.UpdateMissedStartOfCareAsync(new CaseManagement() 
            { 
                RequestId = "C1",
                MissedStartOfCare = null ,
                CaseStatus = "Close",
                IsEscalated = true,
                FollowUPDate = DateTime.UtcNow,
                FollowUPNote = "Note",
                Notes = "Test",
                CreatedDate = DateTime.UtcNow,
                FirstName = "Test",
                LastName = "Test",
                PhoneNumber = "9848574574",
                Extension = "98734",
                Email = "Test@evicore.com",
                CreatedBy = "",
                MissedStartOfCareReason = string.Empty,
                RequestType = "MSOC",
                DateOfService = DateTime.UtcNow,
                CloseReason = "Test",
            });
            var badRequestMSOCReasonResult = Assert.IsType<BadRequestObjectResult>(resultMSOC);
            Assert.Contains("Missed start of care cannot be empty", badRequestMSOCReasonResult?.Value?.ToString());

            _mapper.Setup(m => m.Map<CaseManagementEntity>(It.IsAny<CaseManagement>()))
                .Returns(new CaseManagementEntity() 
                {
                    CaseStatus = "Close",
                    IsEscalated = true,
                    FollowUPDate = DateTime.UtcNow,
                    FollowUPNote = "Note",
                    Notes = "Test",
                    CreatedDate = DateTime.UtcNow,
                    FirstName = "Test",
                    LastName = "Test",
                    PhoneNumber = "9848574574",
                    Extension = "98734",
                    Email = "Test@evicore.com",
                    RequestId = "C1",
                    MissedStartOfCare = true,
                    MissedStartOfCareReason = null,
                    CreatedBy ="",
                    RequestType = "MSOC",
                    DateOfService = DateTime.UtcNow,
                    CloseReason = "Test"

                });
            var resultMSOCReason = await _controller.UpdateMissedStartOfCareAsync(new CaseManagement() 
            {
                CaseStatus = "Close",
                IsEscalated = true,
                FollowUPDate = DateTime.UtcNow,
                FollowUPNote = "Note",
                Notes = "Test",
                CreatedDate = DateTime.UtcNow,
                FirstName = "Test",
                LastName = "Test",
                PhoneNumber = "9848574574",
                Extension = "98734",
                Email = "Test@evicore.com",
                CreatedBy = "",
                RequestId = "C1",
                MissedStartOfCare = true,
                MissedStartOfCareReason = null ,
                RequestType = "MSOC",
                DateOfService = DateTime.UtcNow,
                CloseReason = "Test",
            });
            var badRequestMSOCResult = Assert.IsType<BadRequestObjectResult>(resultMSOCReason);
            Assert.Contains("Missed start of care reason cannot be empty", badRequestMSOCResult?.Value?.ToString());

        }
        [Fact]
        public async Task UpdateCaseStatusAsync_calls_return200()
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
            context.Request.Headers["Authorization"] = $"Bearer {jwt}";

            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = context
            };

            var request = MockCaseManagement();
            var model = new CaseManagementModel();
            _mapper.Setup(m => m.Map<CaseManagementModel>(request)).Returns(new CaseManagementModel 
            { 
                CaseStatus = "Open" ,
                RequestId = "C1",
                IsEscalated = true,
                FollowUPDate = DateTime.UtcNow,
                FollowUPNote = "Note",
                Notes = "Test",
                CreatedDate = DateTime.UtcNow,
                FirstName = "Test",
                LastName = "Test",
                PhoneNumber = "9848574574",
                Extension = "98734",
                Email = "Test@evicore.com",
                MissedStartOfCare = true,
                MissedStartOfCareReason = "",
                RequestType = "MSOC",
                DateOfService = DateTime.UtcNow,
                CloseReason = "Test"
            });
            _mockrequestCaseManagement.Setup(cm => cm.UpdateCaseStatusAsync(model))
                .ReturnsAsync(new CaseManagementResponseModel 
                { 
                    IsSuccess = true,
                    CaseStatus = "Open",
                    RequestId = "C1",
                    IsEscalated = true,
                    FollowUPDate = DateTime.UtcNow,
                    FollowUPNote = "Note",
                    Notes = "Test",
                    CreatedDate = DateTime.UtcNow,
                    FirstName = "Test",
                    LastName = "Test",
                    PhoneNumber = "9848574574",
                    Extension = "98734",
                    Email = "Test@evicore.com",
                    MissedStartOfCare = true,
                    MissedStartOfCareReason = "",
                    CareCoordinationEpisodeDate = "01091998",
                    Error = null,
                    RequestType = "MSOC",
                    DateOfService = DateTime.UtcNow,
                    CloseReason = "Test"
                });
            _mapper.Setup(m => m.Map<CaseManagementEntity>(It.IsAny<CaseManagement>()))
                .Returns(MockCaseManagementEntity);
            await _service.UpdateCaseStatusAsync(model);
            //Act
            var result = await _controller.UpdateCaseStatusAsync(request);
            //Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(200, okResult.StatusCode);
        }

        [Fact]
        public async Task UpdateCaseStatusAsync_ShouldReturnBadRequest_WhenRequestFails()
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
            context.Request.Headers["Authorization"] = $"Bearer {jwt}";

            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = context
            };

            _mapper.Setup(m => m.Map<CaseManagementEntity>(It.IsAny<CaseManagement>()))
                .Returns(new CaseManagementEntity() 
                { 
                    RequestId = string.Empty,
                    CaseStatus = "Close",
                    IsEscalated = true,
                    FollowUPDate = DateTime.UtcNow,
                    FollowUPNote = "Note",
                    Notes = "Test",
                    CreatedDate = DateTime.UtcNow,
                    FirstName = "Test",
                    LastName = "Test",
                    PhoneNumber = "9848574574",
                    Extension = "98734",
                    Email = "Test@evicore.com",
                    MissedStartOfCare = true,
                    MissedStartOfCareReason = "",
                    CreatedBy = "Test",
                    RequestType = "MSOC",
                    DateOfService = DateTime.UtcNow,
                    CloseReason = "Test"
                });
            //Act
            var result = await _controller.UpdateCaseStatusAsync(new CaseManagement() 
            { 
                RequestId = string.Empty,
                CaseStatus = "Close",
                IsEscalated = true,
                FollowUPDate = DateTime.UtcNow,
                FollowUPNote = "Note",
                Notes = "Test",
                CreatedDate = DateTime.UtcNow,
                FirstName = "Test",
                LastName = "Test",
                PhoneNumber = "9848574574",
                Extension = "98734",
                Email = "Test@evicore.com",
                MissedStartOfCare = true,
                MissedStartOfCareReason = "",
                CreatedBy = "Test",
                RequestType = "MSOC",
                DateOfService = DateTime.UtcNow,
                CloseReason = "Test"
            });
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Contains("Request ID cannot be empty", badRequestResult?.Value?.ToString());

            _mapper.Setup(m => m.Map<CaseManagementEntity>(It.IsAny<CaseManagement>()))
                .Returns(new CaseManagementEntity() 
                { 
                    RequestId = "c1",
                    CaseStatus = null ,
                    IsEscalated = true,
                    FollowUPDate = DateTime.UtcNow,
                    FollowUPNote = "Note",
                    Notes = "Test",
                    CreatedDate = DateTime.UtcNow,
                    FirstName = "Test",
                    LastName = "Test",
                    PhoneNumber = "9848574574",
                    Extension = "98734",
                    Email = "Test@evicore.com",
                    MissedStartOfCare = true,
                    MissedStartOfCareReason = "",
                    CreatedBy= "Test",
                    RequestType = "MSOC",
                    DateOfService = DateTime.UtcNow,
                    CloseReason = "Test"
                });
            //Act
            var resultCaseStatus = await _controller.UpdateCaseStatusAsync(new CaseManagement() 
            { 
                RequestId = "c1",
                CaseStatus = null,
                IsEscalated = true,
                FollowUPDate = DateTime.UtcNow,
                FollowUPNote = "Note",
                Notes = "Test",
                CreatedDate = DateTime.UtcNow,
                FirstName = "Test",
                LastName = "Test",
                PhoneNumber = "9848574574",
                Extension = "98734",
                Email = "Test@evicore.com",
                MissedStartOfCare = true,
                MissedStartOfCareReason = "",
                CreatedBy = "Test",
                RequestType = "MSOC",
                DateOfService = DateTime.UtcNow,
                CloseReason = "Test"
            });
            var badRequestCaseStatusResult = Assert.IsType<BadRequestObjectResult>(resultCaseStatus);
            Assert.Contains("Case Status cannot be empty", badRequestCaseStatusResult?.Value?.ToString());
        }
        [Fact]
        public async Task UpdateIsEscalateRequestAsync_calls_return200()
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
            context.Request.Headers["Authorization"] = $"Bearer {jwt}";

            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = context
            };

            var request = MockCaseManagement();
            var model = new CaseManagementModel();
            _mapper.Setup(m => m.Map<CaseManagementModel>(request)).Returns(model);
            _mockrequestCaseManagement.Setup(cm => cm.UpdateIsEscalateRequestAsync(new CaseManagementModel
            {
                IsEscalated = true,
                RequestId = "C1",
                CaseStatus = "",
                FollowUPDate = DateTime.UtcNow,
                FollowUPNote = "Note",
                Notes = "Test",
                CreatedDate = DateTime.UtcNow,
                FirstName = "Test",
                LastName = "Test",
                PhoneNumber = "9848574574",
                Extension = "98734",
                Email = "Test@evicore.com",
                MissedStartOfCare = true,
                MissedStartOfCareReason = "",
                RequestType = "MSOC",
                DateOfService = DateTime.UtcNow,
                CloseReason = "Test"

            }))
                .ReturnsAsync(new CaseManagementResponseModel
                {
                    IsSuccess = true,
                    IsEscalated = true,
                    RequestId = "C1",
                    CaseStatus = "Close",
                    FollowUPDate = DateTime.UtcNow,
                    FollowUPNote = "Note",
                    Notes = "Test",
                    CreatedDate = DateTime.UtcNow,
                    FirstName = "Test",
                    LastName = "Test",
                    PhoneNumber = "9848574574",
                    Extension = "98734",
                    Email = "Test@evicore.com",
                    MissedStartOfCare = true,
                    MissedStartOfCareReason = "",
                    CareCoordinationEpisodeDate = "01091998",
                    Error = null,
                    RequestType = "MSOC",
                    DateOfService = DateTime.UtcNow,
                    CloseReason = "Test"
                });
            _mapper.Setup(m => m.Map<CaseManagementEntity>(It.IsAny<CaseManagement>()))
                .Returns(MockCaseManagementEntity);
            await _service.UpdateIsEscalateRequestAsync(model);
            //Act
            var result = await _controller.UpdateIsEscalateRequestAsync(request);
            //Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(200, okResult.StatusCode);
        }
        [Fact]
        public async Task UpdateIsEscalateRequestAsync_calls_return200_WhenIsEscalatesIsFalse()
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
            context.Request.Headers["Authorization"] = $"Bearer {jwt}";

            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = context
            };

            var request = new CaseManagement()
            {
                RequestId = "C1",
                MissedStartOfCare = true,
                MissedStartOfCareReason = "Test",
                CaseStatus = "Close",
                IsEscalated = false,
                FollowUPDate = DateTime.UtcNow,
                FollowUPNote = "Note",
                Notes = "Test",
                CreatedBy = "Test",
                CreatedDate = DateTime.UtcNow,
                FirstName = "Test",
                LastName = "Test",
                PhoneNumber = "9848574574",
                Extension = "98734",
                Email = "Test@evicore.com",
                RequestType = "MSOC",
                DateOfService = DateTime.UtcNow,
                CloseReason = "Test"
            };
            var model = new CaseManagementModel();
            _mapper.Setup(m => m.Map<CaseManagementModel>(request)).Returns(model);
            _mockrequestCaseManagement.Setup(cm => cm.UpdateIsEscalateRequestAsync(new CaseManagementModel 
            { 
                IsEscalated = false,
                RequestId = "C1",
                CaseStatus = "Close",
                FollowUPDate = DateTime.UtcNow,
                FollowUPNote = "Note",
                Notes = "Test",
                CreatedDate = DateTime.UtcNow,
                FirstName = "Test",
                LastName = "Test",
                PhoneNumber = "9848574574",
                Extension = "98734",
                Email = "Test@evicore.com",
                MissedStartOfCare = true,
                MissedStartOfCareReason = "",
                RequestType = "MSOC",
                DateOfService = DateTime.UtcNow,
                CloseReason = "Test"
            }))
                .ReturnsAsync(new CaseManagementResponseModel 
                { 
                    IsSuccess = true,
                    IsEscalated = false,
                    RequestId = "C1",
                    CaseStatus = "Close",
                    FollowUPDate = DateTime.UtcNow,
                    FollowUPNote = "Note",
                    Notes = "Test",
                    CreatedDate = DateTime.UtcNow,
                    FirstName = "Test",
                    LastName = "Test",
                    PhoneNumber = "9848574574",
                    Extension = "98734",
                    Email = "Test@evicore.com",
                    MissedStartOfCare = true,
                    MissedStartOfCareReason = "",
                    CareCoordinationEpisodeDate ="01091998",
                    Error = null,
                    RequestType = "MSOC",
                    DateOfService = DateTime.UtcNow,
                    CloseReason = "Test"
                });
            _mapper.Setup(m => m.Map<CaseManagementEntity>(It.IsAny<CaseManagement>()))
                .Returns(MockCaseManagementEntity);
            await _service.UpdateIsEscalateRequestAsync(model);
            //Act
            var result = await _controller.UpdateIsEscalateRequestAsync(request);
            //Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(200, okResult.StatusCode);
        }
        [Fact]
        public async Task UpdateFollowUPDateAsync_InternalServerError_whenThrowsException()
        {
            //Arrange
            var request = MockCaseManagement();

            _mapper.Setup(m => m.Map<CaseManagementModel>(request)).Throws(new Exception());

            //Act
            var result = await _controller.UpdateFollowUPDateAsync(request);

            //Assert
            Assert.NotNull(result);
        }
        [Fact]
        public async Task UpdateCaseStatusAsync_InternalServerError_whenThrowsException()
        {
            //Arrange
            var request = MockCaseManagement();

            _mapper.Setup(m => m.Map<CaseManagementModel>(request)).Throws(new Exception());

            //Act
            var result = await _controller.UpdateCaseStatusAsync(request);

            //Assert
            Assert.NotNull(result);
        }
        [Fact]
        public async Task UpdateIsEscalateRequestAsync_InternalServerError_whenThrowsException()
        {
            //Arrange
            var request = MockCaseManagement();

            _mapper.Setup(m => m.Map<CaseManagementModel>(request)).Throws(new Exception());

            //Act
            var result = await _controller.UpdateIsEscalateRequestAsync(request);

            //Assert
            Assert.NotNull(result);
        }
        [Fact]
        public async Task UpdateMissedStartOfCareAsync_InternalServerError_whenThrowsException()
        {
            //Arrange
            var request = MockCaseManagement();

            _mapper.Setup(m => m.Map<CaseManagementModel>(request)).Throws(new Exception());

            //Act
            var result = await _controller.UpdateMissedStartOfCareAsync(request);

            //Assert
            Assert.NotNull(result);

        }
        [Fact]
        public async Task AddNoteAsync_InternalServerError_whenThrowsException()
        {
            //Arrange
            var request = MockCaseManagement();

            _mapper.Setup(m => m.Map<CaseManagementModel>(request)).Throws(new Exception());

            //Act
            var result = await _controller.AddNoteAsync(request);

            //Assert
            Assert.NotNull(result);
        }
        [Fact]
        public async Task UpdateCaseManagerAsync_InternalServerError_whenThrowsException()
        {
            //Arrange
            var request = MockCaseManagement();

            _mapper.Setup(m => m.Map<CaseManagementModel>(request)).Throws(new Exception());

            //Act
            var result = await _controller.UpdateCaseManagerAsync(request);

            //Assert
            Assert.NotNull(result);
        }
        public static CaseManagementEntity MockCaseManagementEntity()
        {
            var request = new CaseManagementEntity()
            {

                RequestId = "C1",
                MissedStartOfCare = true,
                MissedStartOfCareReason = "Test",
                CaseStatus = "Close",
                IsEscalated = true,
                FollowUPDate = DateTime.UtcNow,
                FollowUPNote = "Note",
                Notes = "Test",
                CreatedBy = "Test",
                CreatedDate = DateTime.UtcNow,
                FirstName = "Test",
                LastName = "Test",
                PhoneNumber = "9848574574",
                Extension = "98734",
                Email = "Test@evicore.com",
                RequestType = "MSOC",
                DateOfService = DateTime.UtcNow,
                CloseReason = "Test",
            };
            return request;
        }
        public static CareCoordinationActivityResponseModel MockCaseActivityEntity()
        {
            var request = new CareCoordinationActivityResponseModel()
            {
                CareCoordinationEpisodeId = "CC0000000123",
                CareCoordinationEpisodeDate = DateTime.UtcNow,
                Id = 2,
                Comments = "Test Test",
                UserId = "test",
                RoleType = "R5",
                CreatedBy = "testuser",
                CreatedDate = DateTime.UtcNow,
            };
            return request;
        }
        public static CaseManagement MockCaseManagement()
        {
            var request = new CaseManagement()
            {
                UserId = "test-user",
                RequestId = "C1",
                MissedStartOfCare = true,
                MissedStartOfCareReason = "Test",
                CaseStatus = "Close",
                IsEscalated = true,
                FollowUPDate = DateTime.UtcNow,
                FollowUPNote = "Note",
                Notes = "Test",
                CreatedBy = "Test",
                CreatedDate = DateTime.UtcNow,
                FirstName = "Test",
                LastName = "Test",
                PhoneNumber = "9848574574",
                Extension = "98734",
                Email = "Test@evicore.com",
                RequestType = "MSOC",
                DateOfService = DateTime.UtcNow,
                CloseReason = "Test",
            };
            return request;
        }
        public static string MockGetActivityId()
        {
            var careCoordinationEpisodeId = "CC0000000123";
            return careCoordinationEpisodeId;
        }

        [Fact]
        public async Task UpdateIsEscalateRequestAsync_ShouldReturnBadRequest_WhenRequestFails()
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
            context.Request.Headers["Authorization"] = $"Bearer {jwt}";

            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = context
            };

            _mapper.Setup(m => m.Map<CaseManagementEntity>(It.IsAny<CaseManagement>()))
                .Returns(new CaseManagementEntity() 
                { 
                    RequestId = string.Empty,
                    CaseStatus = "Close",
                    IsEscalated = null,
                    FollowUPDate = DateTime.UtcNow,
                    FollowUPNote = "",
                    Notes = "",
                    CreatedDate = DateTime.UtcNow,
                    FirstName = "",
                    LastName = "",
                    PhoneNumber = "",
                    Extension = "",
                    Email = "",
                    MissedStartOfCare = null,
                    MissedStartOfCareReason = "",
                    CreatedBy = "",
                    RequestType = "MSOC",
                    DateOfService = DateTime.UtcNow,
                    CloseReason = "Test"
                });
            //Act
            var result = await _controller.UpdateIsEscalateRequestAsync(new CaseManagement() 
            { 
                RequestId = string.Empty ,
                CaseStatus = "",
                IsEscalated = null,
                FollowUPDate = DateTime.UtcNow,
                FollowUPNote = "",
                Notes = "",
                CreatedDate = DateTime.UtcNow,
                FirstName = "",
                LastName = "",
                PhoneNumber = "",
                Extension = "",
                Email = "",
                MissedStartOfCare = null,
                MissedStartOfCareReason = "",
                CreatedBy = "",
                RequestType = "MSOC",
                DateOfService = DateTime.UtcNow,
                CloseReason = "Test"
            });
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);


            _mapper.Setup(m => m.Map<CaseManagementEntity>(It.IsAny<CaseManagement>()))
                .Returns(new CaseManagementEntity() 
                { 
                    RequestId = "c1",
                    CaseStatus = null,
                    IsEscalated = null,
                    FollowUPDate = DateTime.UtcNow,
                    FollowUPNote = "Note",
                    Notes = "Test",
                    CreatedDate = DateTime.UtcNow,
                    FirstName = "Test",
                    LastName = "Test",
                    PhoneNumber = "9848574574",
                    Extension = "98734",
                    Email = "Test@evicore.com",
                    MissedStartOfCare = null,
                    MissedStartOfCareReason = "",
                    CreatedBy ="test",
                    RequestType = "MSOC",
                    DateOfService = DateTime.UtcNow,
                    CloseReason = "Test"
                });
            //Act
            var resultCaseStatus = await _controller.UpdateIsEscalateRequestAsync(new CaseManagement() 
            { 
                RequestId = "c1",
                IsEscalated = null,
                CaseStatus = "Close",
                FollowUPDate = DateTime.UtcNow,
                FollowUPNote = "Note",
                Notes = "Test",
                CreatedDate = DateTime.UtcNow,
                FirstName = "Test",
                LastName = "Test",
                PhoneNumber = "9848574574",
                Extension = "98734",
                Email = "Test@evicore.com",
                MissedStartOfCare = null,
                MissedStartOfCareReason = "",
                CreatedBy="test",
                RequestType = "MSOC",
                DateOfService = DateTime.UtcNow,
                CloseReason = "Test"
            });
            var badRequestEsacalateResult = Assert.IsType<BadRequestObjectResult>(resultCaseStatus);

            Assert.Contains("Request ID cannot be empty", badRequestResult?.Value?.ToString());
            Assert.Contains("Escalate cannot be empty", badRequestEsacalateResult?.Value?.ToString());
        }
        [Fact]
        public async Task UpdateFollowUPDateAsync_calls_return200()
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
            context.Request.Headers["Authorization"] = $"Bearer {jwt}";

            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = context
            };

            var request = MockCaseManagement();
            var model = new CaseManagementModel();
            _mapper.Setup(m => m.Map<CaseManagementModel>(request)).Returns(new CaseManagementModel 
            {
                FollowUPDate = DateTime.UtcNow,
                FollowUPNote = "Test" ,
                RequestId = "C1",
                CaseStatus = "Close",
                IsEscalated = null,
                Notes = "Test",
                CreatedDate = DateTime.UtcNow,
                FirstName = "Test",
                LastName = "Test",
                PhoneNumber = "9848574574",
                Extension = "98734",
                Email = "Test@evicore.com",
                MissedStartOfCare = null,
                MissedStartOfCareReason = "",
                RequestType = "MSOC",
                DateOfService = DateTime.UtcNow,
                CloseReason = "Test"
            });
            _mockrequestCaseManagement.Setup(cm => cm.UpdateFollowUpDateAsync(model))
                .ReturnsAsync(new CaseManagementResponseModel 
                {
                    IsSuccess = true,
                    FollowUPDate = DateTime.UtcNow,
                    FollowUPNote = "Test",
                    RequestId = "C1",
                    CaseStatus = "Close",
                    IsEscalated = null,
                    Notes = "Test",
                    CreatedDate = DateTime.UtcNow,
                    FirstName = "Test",
                    LastName = "Test",
                    PhoneNumber = "9848574574",
                    Extension = "98734",
                    Email = "Test@evicore.com",
                    MissedStartOfCare = null,
                    MissedStartOfCareReason = "",
                    RequestType = "MSOC",
                    DateOfService = DateTime.UtcNow,
                    CloseReason = "Test"
                });
            _mapper.Setup(m => m.Map<CaseManagementEntity>(It.IsAny<CaseManagement>()))
                .Returns(MockCaseManagementEntity);
            await _service.UpdateFollowUpDateAsync(model);
            //Act
            var result = await _controller.UpdateFollowUPDateAsync(request);
            //Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(200, okResult.StatusCode);
        }

        [Fact]
        public async Task UpdateFollowUPDateAsync_ShouldReturnBadRequest_WhenRequestFails()
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
            context.Request.Headers["Authorization"] = $"Bearer {jwt}";

            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = context
            };

            _mapper.Setup(m => m.Map<CaseManagementEntity>(It.IsAny<CaseManagement>()))
                .Returns(new CaseManagementEntity() 
                { 
                    RequestId = string.Empty,
                    CaseStatus = "Close",
                    IsEscalated = true,
                    FollowUPDate = DateTime.UtcNow,
                    FollowUPNote = "Note",
                    Notes = "Test",
                    CreatedDate = DateTime.UtcNow,
                    FirstName = "Test",
                    LastName = "Test",
                    PhoneNumber = "9848574574",
                    Extension = "98734",
                    Email = "Test@evicore.com",
                    MissedStartOfCare = true,
                    MissedStartOfCareReason = "",
                    CreatedBy = "Test",
                    RequestType = "MSOC",
                    DateOfService = DateTime.UtcNow,
                    CloseReason = "Test"
                });
            //Act
            var result = await _controller.UpdateFollowUPDateAsync(new CaseManagement() 
            { 
                RequestId = string.Empty ,
                CaseStatus = "Close",
                IsEscalated = true,
                FollowUPDate = DateTime.UtcNow,
                FollowUPNote = "Note",
                Notes = "Test",
                CreatedDate = DateTime.UtcNow,
                FirstName = "Test",
                LastName = "Test",
                PhoneNumber = "9848574574",
                Extension = "98734",
                Email = "Test@evicore.com",
                MissedStartOfCare = true,
                MissedStartOfCareReason = "",
                CreatedBy= "Test",
                RequestType = "MSOC",
                DateOfService = DateTime.UtcNow,
                CloseReason = "Test"
            });
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Contains("Request ID cannot be empty", badRequestResult?.Value?.ToString());

            _mapper.Setup(m => m.Map<CaseManagementEntity>(It.IsAny<CaseManagement>()))
                .Returns(new CaseManagementEntity() 
                { 
                    RequestId = "c1",
                    FollowUPDate = null ,
                    CaseStatus = "Close",
                    IsEscalated = null,
                    FollowUPNote = "Note",
                    Notes = "Test",
                    CreatedDate = DateTime.UtcNow,
                    FirstName = "Test",
                    LastName = "Test",
                    PhoneNumber = "9848574574",
                    Extension = "98734",
                    Email = "Test@evicore.com",
                    MissedStartOfCare = null,
                    MissedStartOfCareReason = "",
                    RequestType = "MSOC",
                    DateOfService = DateTime.UtcNow,
                    CloseReason = "Test"
                });
            //Act
            var resultFollowUpDate = await _controller.UpdateFollowUPDateAsync(new CaseManagement() 
            { 
                RequestId = "c1",
                FollowUPDate = null,
                CaseStatus = "Close",
                IsEscalated = null,
                FollowUPNote = "Note",
                Notes = "Test",
                CreatedDate = DateTime.UtcNow,
                FirstName = "Test",
                LastName = "Test",
                PhoneNumber = "9848574574",
                Extension = "98734",
                Email = "Test@evicore.com",
                MissedStartOfCare = null,
                MissedStartOfCareReason = "",
                CreatedBy = "Test",
                RequestType = "MSOC",
                DateOfService = DateTime.UtcNow,
                CloseReason = "Test"
            });
            var badFollowUpDateResult = Assert.IsType<BadRequestObjectResult>(resultFollowUpDate);
            Assert.Contains("Follow-Up date cannot be empty", badFollowUpDateResult?.Value?.ToString());

            _mapper.Setup(m => m.Map<CaseManagementEntity>(It.IsAny<CaseManagement>()))
                .Returns(new CaseManagementEntity() 
                { 
                    RequestId = "c1",
                    FollowUPDate = Convert.ToDateTime("2025-10-07 00:00:00.000"),
                    CaseStatus = "Close",
                    IsEscalated = null,
                    FollowUPNote = "Note",
                    Notes = "Test",
                    CreatedDate = DateTime.UtcNow,
                    FirstName = "Test",
                    LastName = "Test",
                    PhoneNumber = "9848574574",
                    Extension = "98734",
                    Email = "Test@evicore.com",
                    MissedStartOfCare = null,
                    MissedStartOfCareReason = "",
                    CreatedBy = "test",
                    RequestType = "MSOC",
                    DateOfService = DateTime.UtcNow,
                    CloseReason = "Test"
                });
            //Act
            var resultMaxFollowUpDate = await _controller.UpdateFollowUPDateAsync(new CaseManagement() 
            { 
                RequestId = "c1",
                FollowUPDate = null,
                CaseStatus = "Close",
                IsEscalated = null,
                FollowUPNote = "Note",
                Notes = "Test",
                CreatedDate = DateTime.UtcNow,
                FirstName = "Test",
                LastName = "Test",
                PhoneNumber = "9848574574",
                Extension = "98734",
                Email = "Test@evicore.com",
                MissedStartOfCare = null,
                MissedStartOfCareReason = "",
                CreatedBy = "test",
                RequestType = "MSOC",
                DateOfService = DateTime.UtcNow,
                CloseReason = "Test"
            });
            var badMaxFollowUpDateResult = Assert.IsType<BadRequestObjectResult>(resultMaxFollowUpDate);
            Assert.Contains("Follow-up date cannot be more than 45 days from today", badMaxFollowUpDateResult?.Value?.ToString());

        }

        //[Fact]
        //public async Task UpdateFollowUPDateAsync_ShouldReturnBadRequest_WhenRequestFails()
        //{
        //    _mapper.Setup(m => m.Map<CaseManagementEntity>(It.IsAny<CaseManagement>()))
        //        .Returns(new CaseManagementEntity() 
        //        { 
        //            RequestId = string.Empty,
        //            CaseStatus = "Close",
        //            IsEscalated = true,
        //            FollowUPDate = DateTime.UtcNow,
        //            FollowUPNote = "Note",
        //            Notes = "Test",
        //            CreatedDate = DateTime.UtcNow,
        //            FirstName = "Test",
        //            LastName = "Test",
        //            PhoneNumber = "9848574574",
        //            Extension = "98734",
        //            Email = "Test@evicore.com",
        //            MissedStartOfCare = true,
        //            MissedStartOfCareReason = "",
        //            CreatedBy = "Test"
        //        });
        //    //Act
        //    var result = await _controller.UpdateFollowUPDateAsync(new CaseManagement() 
        //    { 
        //        RequestId = string.Empty ,
        //        CaseStatus = "Close",
        //        IsEscalated = true,
        //        FollowUPDate = DateTime.UtcNow,
        //        FollowUPNote = "Note",
        //        Notes = "Test",
        //        CreatedDate = DateTime.UtcNow,
        //        FirstName = "Test",
        //        LastName = "Test",
        //        PhoneNumber = "9848574574",
        //        Extension = "98734",
        //        Email = "Test@evicore.com",
        //        MissedStartOfCare = true,
        //        MissedStartOfCareReason = "",
        //        CreatedBy= "Test"
        //    });
        //    var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        //    Assert.Contains("Request ID cannot be empty", badRequestResult?.Value?.ToString());

        //    _mapper.Setup(m => m.Map<CaseManagementEntity>(It.IsAny<CaseManagement>()))
        //        .Returns(new CaseManagementEntity() 
        //        { 
        //            RequestId = "c1",
        //            FollowUPDate = null ,
        //            CaseStatus = "Close",
        //            IsEscalated = null,
        //            FollowUPNote = "Note",
        //            Notes = "Test",
        //            CreatedDate = DateTime.UtcNow,
        //            FirstName = "Test",
        //            LastName = "Test",
        //            PhoneNumber = "9848574574",
        //            Extension = "98734",
        //            Email = "Test@evicore.com",
        //            MissedStartOfCare = null,
        //            MissedStartOfCareReason = ""
        //        });
        //    //Act
        //    var resultFollowUpDate = await _controller.UpdateFollowUPDateAsync(new CaseManagement() 
        //    { 
        //        RequestId = "c1",
        //        FollowUPDate = null,
        //        CaseStatus = "Close",
        //        IsEscalated = null,
        //        FollowUPNote = "Note",
        //        Notes = "Test",
        //        CreatedDate = DateTime.UtcNow,
        //        FirstName = "Test",
        //        LastName = "Test",
        //        PhoneNumber = "9848574574",
        //        Extension = "98734",
        //        Email = "Test@evicore.com",
        //        MissedStartOfCare = null,
        //        MissedStartOfCareReason = "",
        //        CreatedBy = "Test"
        //    });
        //    var badFollowUpDateResult = Assert.IsType<BadRequestObjectResult>(resultFollowUpDate);
        //    Assert.Contains("Follow-Up date cannot be empty", badFollowUpDateResult?.Value?.ToString());

        //    _mapper.Setup(m => m.Map<CaseManagementEntity>(It.IsAny<CaseManagement>()))
        //        .Returns(new CaseManagementEntity() 
        //        { 
        //            RequestId = "c1",
        //            FollowUPDate = Convert.ToDateTime("2025-05-07 00:00:00.000"),
        //            CaseStatus = "Close",
        //            IsEscalated = null,
        //            FollowUPNote = "Note",
        //            Notes = "Test",
        //            CreatedDate = DateTime.UtcNow,
        //            FirstName = "Test",
        //            LastName = "Test",
        //            PhoneNumber = "9848574574",
        //            Extension = "98734",
        //            Email = "Test@evicore.com",
        //            MissedStartOfCare = null,
        //            MissedStartOfCareReason = "",
        //            CreatedBy = "test"
        //        });
        //    //Act
        //    var resultMaxFollowUpDate = await _controller.UpdateFollowUPDateAsync(new CaseManagement() 
        //    { 
        //        RequestId = "c1",
        //        FollowUPDate = null,
        //        CaseStatus = "Close",
        //        IsEscalated = null,
        //        FollowUPNote = "Note",
        //        Notes = "Test",
        //        CreatedDate = DateTime.UtcNow,
        //        FirstName = "Test",
        //        LastName = "Test",
        //        PhoneNumber = "9848574574",
        //        Extension = "98734",
        //        Email = "Test@evicore.com",
        //        MissedStartOfCare = null,
        //        MissedStartOfCareReason = "",
        //        CreatedBy = "test"
        //    });
        //    var badMaxFollowUpDateResult = Assert.IsType<BadRequestObjectResult>(resultMaxFollowUpDate);
        //    Assert.Contains("Follow-up date cannot be more than 45 days from today", badMaxFollowUpDateResult?.Value?.ToString());

        //}


        [Fact]
        public async Task AddNoteAsync_ShouldReturnBadRequest_WhenRequestFails()
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
            context.Request.Headers["Authorization"] = $"Bearer {jwt}";

            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = context
            };

            _mapper.Setup(m => m.Map<CaseManagementEntity>(It.IsAny<CaseManagement>()))
                .Returns(new CaseManagementEntity() 
                { 
                    RequestId = string.Empty ,
                    CaseStatus = "Close",
                    IsEscalated = null,
                    FollowUPDate = DateTime.UtcNow,
                    FollowUPNote = "Note",
                    Notes = "Test",
                    CreatedDate = DateTime.UtcNow,
                    FirstName = "Test",
                    LastName = "Test",
                    PhoneNumber = "9848574574",
                    Extension = "98734",
                    Email = "Test@evicore.com",
                    MissedStartOfCare = null,
                    MissedStartOfCareReason = "",
                    CreatedBy = "Test",
                    RequestType = "MSOC",
                    DateOfService = DateTime.UtcNow,
                    CloseReason = "Test"
                });
            //Act
            var result = await _controller.AddNoteAsync(new CaseManagement() 
            { 
                RequestId = string.Empty ,
                CaseStatus = "Close",
                IsEscalated = null,
                FollowUPDate = DateTime.UtcNow,
                FollowUPNote = "Note",
                Notes = "Test",
                CreatedDate = DateTime.UtcNow,
                FirstName = "Test",
                LastName = "Test",
                PhoneNumber = "9848574574",
                Extension = "98734",
                Email = "Test@evicore.com",
                MissedStartOfCare = null,
                MissedStartOfCareReason = "",
                CreatedBy = "Test",
                RequestType = "MSOC",
                DateOfService = DateTime.UtcNow,
                CloseReason = "Test"
            });
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Contains("Request ID cannot be empty", badRequestResult?.Value?.ToString());

            _mapper.Setup(m => m.Map<CaseManagementEntity>(It.IsAny<CaseManagement>()))
                .Returns(new CaseManagementEntity() 
                { 
                    RequestId = "c1",
                    Notes = null ,
                    CaseStatus = "Close",
                    IsEscalated = null,
                    FollowUPDate = DateTime.UtcNow,
                    FollowUPNote = "Note",
                    CreatedDate = DateTime.UtcNow,
                    FirstName = "Test",
                    LastName = "Test",
                    PhoneNumber = "9848574574",
                    Extension = "98734",
                    Email = "Test@evicore.com",
                    MissedStartOfCare = null,
                    MissedStartOfCareReason = "",
                    CreatedBy = "Test",
                    RequestType = "MSOC",
                    DateOfService = DateTime.UtcNow,
                    CloseReason = "Test"
                });
            //Act
            var resultNote = await _controller.AddNoteAsync(new CaseManagement() 
            { 
                RequestId = "c1",
                Notes = null ,
                CaseStatus = "Close",
                IsEscalated = null,
                FollowUPDate = DateTime.UtcNow,
                FollowUPNote = "Note",
                CreatedDate = DateTime.UtcNow,
                FirstName = "Test",
                LastName = "Test",
                PhoneNumber = "9848574574",
                Extension = "98734",
                Email = "Test@evicore.com",
                MissedStartOfCare = null,
                MissedStartOfCareReason = "",
                CreatedBy = "Test",
                RequestType = "MSOC",
                DateOfService = DateTime.UtcNow,
                CloseReason = "Test"
            });
            var badEmptyNoteResult = Assert.IsType<BadRequestObjectResult>(resultNote);
            Assert.Contains("Note cannot be empty", badEmptyNoteResult?.Value?.ToString());

        }
        [Fact]
        public async Task AddNoteAsync_call_return200()
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
            context.Request.Headers["Authorization"] = $"Bearer {jwt}";

            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = context
            };

            var request = MockCaseManagement();
            var model = new CaseManagementModel() {
                RequestId = "C1",
                MissedStartOfCare = true,
                MissedStartOfCareReason = "Test",
                CaseStatus = "Close",
                IsEscalated = true,
                FollowUPDate = DateTime.UtcNow,
                FollowUPNote = "Note",
                Notes = "Test",
                CreatedDate = DateTime.UtcNow,
                FirstName = "Test",
                LastName = "Test",
                PhoneNumber = "9848574574",
                Extension = "98734",
                Email = "Test@evicore.com",
                RequestType = "MSOC",
                DateOfService = DateTime.UtcNow,
                CloseReason = "Test"
            };
            _mapper.Setup(m => m.Map<CaseManagementModel>(request)).Returns(model);
            _mockrequestCaseManagement.Setup(cm => cm.AddNoteAsync(model))
                .ReturnsAsync(new CaseManagementResponseModel 
                { 
                    IsSuccess = true,
                    FollowUPDate = DateTime.UtcNow,
                    FollowUPNote = "Test",
                    CaseStatus = "Close",
                    IsEscalated = null,
                    Notes = "Test",
                    CreatedDate = DateTime.UtcNow,
                    FirstName = "Test",
                    LastName = "Test",
                    PhoneNumber = "9848574574",
                    Extension = "98734",
                    Email = "Test@evicore.com",
                    MissedStartOfCare = null,
                    MissedStartOfCareReason = "",
                    CareCoordinationEpisodeDate ="01091998",
                    Error = null,
                    RequestId = "c1",
                    RequestType = "MSOC",
                    DateOfService = DateTime.UtcNow,
                    CloseReason = "Test",
                });
            _mapper.Setup(m => m.Map<CaseManagementEntity>(It.IsAny<CaseManagement>()))
                .Returns(MockCaseManagementEntity);

            //Act
            var result = await _controller.AddNoteAsync(request);
            //Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(200, okResult.StatusCode);

        }
        [Fact]
        public async Task AddNoteAsync_returnBadRequest_whenIsSuccessIsFalse()
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
            context.Request.Headers["Authorization"] = $"Bearer {jwt}";

            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = context
            };
            var request = MockCaseManagement();
            var model = new CaseManagementModel()
            {
                RequestId = "C1",
                MissedStartOfCare = true,
                MissedStartOfCareReason = "Test",
                CaseStatus = "Close",
                IsEscalated = true,
                FollowUPDate = DateTime.UtcNow,
                FollowUPNote = "Note",
                Notes = "Test",
                CreatedDate = DateTime.UtcNow,
                FirstName = "Test",
                LastName = "Test",
                PhoneNumber = "9848574574",
                Extension = "98734",
                Email = "Test@evicore.com",
                RequestType = "MSOC",
                DateOfService = DateTime.UtcNow,
                CloseReason = "Test"
            };
            _mapper.Setup(m => m.Map<CaseManagementModel>(request)).Returns(model);
            _mockrequestCaseManagement.Setup(cm => cm.AddNoteAsync(model))
                .ReturnsAsync(new CaseManagementResponseModel 
                { 
                    IsSuccess = false,
                    FollowUPDate = DateTime.UtcNow,
                    FollowUPNote = "Test",
                    CaseStatus = "Close",
                    IsEscalated = null,
                    Notes = "Test",
                    CreatedDate = DateTime.UtcNow,
                    FirstName = "Test",
                    LastName = "Test",
                    PhoneNumber = "9848574574",
                    Extension = "98734",
                    Email = "Test@evicore.com",
                    MissedStartOfCare = null,
                    MissedStartOfCareReason = "",
                    CareCoordinationEpisodeDate ="01091998",
                    RequestId = "c1",
                    Error = null,
                    RequestType = "MSOC",
                    DateOfService = DateTime.UtcNow,
                    CloseReason = "Test"

                });
            _mapper.Setup(m => m.Map<CaseManagementEntity>(It.IsAny<CaseManagement>()))
                .Returns(MockCaseManagementEntity);

            //Act
            var result = await _controller.AddNoteAsync(request);
            //Assert
            var badResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal(400, badResult.StatusCode);

        }
        [Fact]
        public async Task UpdateCaseManagerAsync_calls_return200()
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
            context.Request.Headers["Authorization"] = $"Bearer {jwt}";

            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = context
            };
            var request = MockCaseManagement();
            var model = new CaseManagementModel();
            _mapper.Setup(m => m.Map<CaseManagementModel>(request))
                .Returns(new CaseManagementModel 
                {
                    FirstName = "test",
                    LastName = "test",
                    PhoneNumber = "9839483948",
                    Extension = "485",
                    Email = "test@evicore.com",
                    CaseStatus = "Close",
                    IsEscalated = null,
                    FollowUPDate = DateTime.UtcNow,
                    FollowUPNote = "Note",
                    Notes = "Test",
                    CreatedDate = DateTime.UtcNow,
                    MissedStartOfCare = null,
                    MissedStartOfCareReason = "",
                    RequestId = "c1",
                    RequestType = "MSOC",
                    DateOfService = DateTime.UtcNow,
                    CloseReason = "Test"
                });
            _mockrequestCaseManagement.Setup(cm => cm.UpdateCaseManagerAsync(model))
                .ReturnsAsync(new CaseManagementResponseModel 
                { 
                    IsSuccess = true,
                    FirstName = "test",
                    LastName = "test",
                    PhoneNumber = "9839483948",
                    Extension = "485",
                    Email = "test@evicore.com",
                    CaseStatus = "Close",
                    IsEscalated = null,
                    FollowUPDate = DateTime.UtcNow,
                    FollowUPNote = "Note",
                    Notes = "Test",
                    CreatedDate = DateTime.UtcNow,
                    MissedStartOfCare = null,
                    MissedStartOfCareReason = "",
                    RequestId = "c1",
                    CareCoordinationEpisodeDate="01091998",
                    Error = null,
                    RequestType = "MSOC",
                    DateOfService = DateTime.UtcNow,
                    CloseReason = "Test"
                });
            _mapper.Setup(m => m.Map<CaseManagementEntity>(It.IsAny<CaseManagement>()))
                .Returns(MockCaseManagementEntity);
            await _service.UpdateCaseManagerAsync(model);
            //Act
            var result = await _controller.UpdateCaseManagerAsync(request);
            //Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(200, okResult.StatusCode);
        }
        [Fact]
        public async Task AddCaseManagerAsync_ShouldReturnBadRequest_WhenRequestFails()
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
            context.Request.Headers["Authorization"] = $"Bearer {jwt}";

            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = context
            };

            _mapper.Setup(m => m.Map<CaseManagementEntity>(It.IsAny<CaseManagement>()))
                .Returns(new CaseManagementEntity() { RequestId = string.Empty });
            //Act
            var resultRequestId = await _controller.UpdateCaseManagerAsync(new CaseManagement() { RequestId = string.Empty });
            var emptyequestIdEmptyResult = Assert.IsType<BadRequestObjectResult>(resultRequestId);
            Assert.Contains("Request ID cannot be empty", emptyequestIdEmptyResult?.Value?.ToString());

            _mapper.Setup(m => m.Map<CaseManagementEntity>(It.IsAny<CaseManagement>()))
                .Returns(new CaseManagementEntity() { RequestId = "c1", FirstName = null });
            var resultFirstName = await _controller.UpdateCaseManagerAsync(new CaseManagement() { RequestId = "c1", FirstName = null });
            var emptyFirstNameEmptyResult = Assert.IsType<BadRequestObjectResult>(resultFirstName);
            Assert.Contains("First Name cannot be empty", emptyFirstNameEmptyResult?.Value?.ToString());

            _mapper.Setup(m => m.Map<CaseManagementEntity>(It.IsAny<CaseManagement>()))
                .Returns(new CaseManagementEntity() { RequestId = "c1", FirstName = "Test", LastName = null });
            var resultLastName = await _controller.UpdateCaseManagerAsync(new CaseManagement() { RequestId = "c1", FirstName = "Test", LastName = null });
            var emptyLastNameEmptyResult = Assert.IsType<BadRequestObjectResult>(resultLastName);
            Assert.Contains("Last Name cannot be empty", emptyLastNameEmptyResult?.Value?.ToString());

            _mapper.Setup(m => m.Map<CaseManagementEntity>(It.IsAny<CaseManagement>()))
                .Returns(new CaseManagementEntity() { RequestId = "c1", FirstName = "Test", LastName = "Test", Email = null });
            var resultEmailName = await _controller.UpdateCaseManagerAsync(new CaseManagement() { RequestId = "c1", FirstName = "Test", LastName = "Test", Email = null });
            var emptyEmailEmptyResult = Assert.IsType<BadRequestObjectResult>(resultEmailName);
            Assert.Contains("Email cannot be empty", emptyEmailEmptyResult?.Value?.ToString());

            _mapper.Setup(m => m.Map<CaseManagementEntity>(It.IsAny<CaseManagement>()))
                .Returns(new CaseManagementEntity() { RequestId = "c1", FirstName = "Test", LastName = "Test", Email = "Test@evicore.com", PhoneNumber = null });
            var resultPhone = await _controller.UpdateCaseManagerAsync(new CaseManagement() { RequestId = "c1", FirstName = "Test", LastName = "Test", Email = "Test@evicore.com", PhoneNumber = null });
            var emptyPhoneResult = Assert.IsType<BadRequestObjectResult>(resultPhone);
            Assert.Contains("Phone Number cannot be empty", emptyPhoneResult?.Value?.ToString());

            _mapper.Setup(m => m.Map<CaseManagementEntity>(It.IsAny<CaseManagement>()))
                .Returns(new CaseManagementEntity() { RequestId = "c1", FirstName = "Test", LastName = "Test", Email = "Test@evicore.com", PhoneNumber = "9837483748", Extension = null });
            var resultExtension = await _controller.UpdateCaseManagerAsync(new CaseManagement() { RequestId = "c1", FirstName = "Test", LastName = "Test", Email = "Test@evicore.com", PhoneNumber = "9837483748", Extension = null });
            var emptyExtensionResult = Assert.IsType<BadRequestObjectResult>(resultExtension);
            Assert.Contains("Extension cannot be empty", emptyExtensionResult?.Value?.ToString());
        }
        [Fact]
        public async Task GetActivityAsync_calls_return200()
        {
            var request = MockGetActivityId();
            var expectedResponse = new List<CareCoordinationActivityResponseModel>();
            expectedResponse.Add(new CareCoordinationActivityResponseModel()
            {
                CareCoordinationEpisodeDate = DateTime.Now,
                CareCoordinationEpisodeId = "CC12345690",
                Comments = null,
                CreatedDate = DateTime.Now,
                CreatedBy = null,
                Id = 123456,
                RoleType = null,
                UserId = null
            });
            _mockrequestCaseManagement.Setup(cm => cm.GetActivityAsync(request))
               .ReturnsAsync(expectedResponse);

            _mapper.Setup(m => m.Map<CareCoordinationActivityResponseModel>(It.IsAny<CaseManagement>()))
                .Returns(MockCaseActivityEntity);
            await _service.GetActivityAsync(request);
            //Act
            var result = await _controller.GetActivityAsync(request);
            //Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(200, okResult.StatusCode);
        }
        [Fact]
        public async Task GetActivityAsync_ShouldReturnBadRequest_WhenRequestFails()
        {
            string request = string.Empty;
            //Act
            var resultRequestId = await _controller.GetActivityAsync(request);
            var emptyequestIdEmptyResult = Assert.IsType<BadRequestObjectResult>(resultRequestId);
            Assert.Contains("Episode ID cannot be empty", emptyequestIdEmptyResult?.Value?.ToString());

        }
    }
}
