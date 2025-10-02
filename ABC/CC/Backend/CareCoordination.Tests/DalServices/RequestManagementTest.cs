using AutoMapper;
using CareCoordination.Api.DTOs;
using CareCoordination.Application.Abstracts.DALInterfaces;
using CareCoordination.Application.Models;
using CareCoordination.DAL.Implementation;
using CareCoordination.DAL.Mappers;
using CareCoordination.Domain.Models;
using Dapper;
using Microsoft.AspNetCore.Http.HttpResults;
using Moq;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;
using Xunit;

namespace CareCoordination.Tests.DalServices
{
    public class RequestManagementTest
    {
        private readonly Mock<IDbService> _mockDbService;
        private readonly RequestManagement _requestManagement;

        public RequestManagementTest()
        {
            _mockDbService = new Mock<IDbService>();
            _requestManagement = new RequestManagement(_mockDbService.Object);
        }

        public static CaseManagementModel MockCaseManagement()
        {
            var request = new CaseManagementModel()
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
                CloseReason = "Test",
            };
            return request;
        }
        public static CaseManagementResponseModel MockCaseManagementResponseModel()
        {
            var response = new CaseManagementResponseModel()
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
                IsSuccess = true,
                CareCoordinationEpisodeDate = "01091998",
                Error = null,
                RequestType = "MSOC",
                DateOfService = DateTime.UtcNow,
                CloseReason = "Test"
            };
            return response;
        }

        [Fact]
        public async Task UpdateMissedStartOfCareAsync_shouldCall_ExecuteUpdateAsync()
        {
            // Arrange
            var request = MockCaseManagement();
            _mockDbService.Setup(d => d.QueryFirstOrDefaultAsync<CaseManagementResponseModel>(
                It.IsAny<string>(), It.IsAny<DynamicParameters>(), CommandType.StoredProcedure, null, null)).ReturnsAsync(new CaseManagementResponseModel { IsSuccess=true});

            // Act
            var result = await _requestManagement.UpdateMissedStartOfCareAsync(request);

            // Assert
            Assert.True(result.IsSuccess);
            _mockDbService.Verify(d => d.QueryFirstOrDefaultAsync<CaseManagementResponseModel>(It.IsAny<string>(), It.IsAny<DynamicParameters>(), CommandType.StoredProcedure, null, null), Times.Once);

        }
        [Fact]
        public async Task UpdateCaseStatusAsync_should_Return_ValiedResponse()
        {
            //arange
            var request = MockCaseManagement();
            var expectedResponse = MockCaseManagementResponseModel();
            _mockDbService.Setup(d => d.QueryFirstOrDefaultAsync<CaseManagementResponseModel>(It.IsAny<string>(), It.IsAny<DynamicParameters>(), CommandType.StoredProcedure, null, null)).ReturnsAsync(expectedResponse);

            //Act
            var result = await _requestManagement.UpdateCaseStatusAsync(request);

            //Assert
            Assert.NotNull(result);
            Assert.True(result.IsSuccess);

        }
        [Fact]
        public async Task UpdateFollowUpDateAsync_should_Return_ValidResponse()
        {
            //arange
            var request = MockCaseManagement();
            var expectedResponse = MockCaseManagementResponseModel();
            _mockDbService.Setup(d => d.QueryFirstOrDefaultAsync<CaseManagementResponseModel>(It.IsAny<string>(), It.IsAny<DynamicParameters>(), CommandType.StoredProcedure, null, null)).ReturnsAsync(expectedResponse);

            //Act
            var result = await _requestManagement.UpdateFollowUpDateAsync(request);

            //Assert
            Assert.NotNull(result);
            Assert.True(result.IsSuccess);

        }
        [Fact]
        public async Task UpdateCaseManagerAsync_should_Return_ValidResponse()
        {
            //arange
            var request = MockCaseManagement();
            var expectedResponse = MockCaseManagementResponseModel();
            _mockDbService.Setup(d => d.QueryFirstOrDefaultAsync<CaseManagementResponseModel>(It.IsAny<string>(), It.IsAny<DynamicParameters>(), CommandType.StoredProcedure, null, null)).ReturnsAsync(expectedResponse);

            //Act
            var result = await _requestManagement.UpdateCaseManagerAsync(request);

            //Assert
            Assert.NotNull(result);
            Assert.True(result.IsSuccess);

        }
        [Fact]
        public async Task UpdateCaseManagerAsync_should_HandleException()
        {
            //arange
            var request = MockCaseManagement();
            _mockDbService.Setup(d => d.QueryFirstOrDefaultAsync<CaseManagementResponseModel>(It.IsAny<string>(), It.IsAny<DynamicParameters>(), CommandType.StoredProcedure, null, null)).ThrowsAsync(new SystemException("Database error"));

            //Act and assert
            await Assert.ThrowsAsync<System.SystemException>(() => _requestManagement.UpdateCaseManagerAsync(request));

        }
        [Fact]
        public async Task UpdateIsEscalateRequestAsync_should_HandleException()
        {
            //arange
            var request = MockCaseManagement();
            _mockDbService.Setup(d => d.QueryFirstOrDefaultAsync<CaseManagementResponseModel>(It.IsAny<string>(), It.IsAny<DynamicParameters>(), CommandType.StoredProcedure, null, null)).ThrowsAsync(new SystemException("Database error"));

            //Act and assert
           await  Assert.ThrowsAsync<System.SystemException>(()=> _requestManagement.UpdateIsEscalateRequestAsync(request));

        }
        [Fact]
        public async Task UpdateFollowUpDateAsync_should_HandleException()
        {
            //arange
            var request = MockCaseManagement();
            _mockDbService.Setup(d => d.QueryFirstOrDefaultAsync<CaseManagementResponseModel>(It.IsAny<string>(), It.IsAny<DynamicParameters>(), CommandType.StoredProcedure, null, null)).ThrowsAsync(new SystemException("Database error"));

            //Act and assert
            await Assert.ThrowsAsync<System.SystemException>(() => _requestManagement.UpdateFollowUpDateAsync(request));

        }
        [Fact]
        public async Task AddNoteAsync_should_HandleException()
        {
            //arange
            var request = MockCaseManagement();
            _mockDbService.Setup(d => d.QueryFirstOrDefaultAsync<CaseManagementResponseModel>(It.IsAny<string>(), It.IsAny<DynamicParameters>(), CommandType.StoredProcedure, null, null)).ThrowsAsync(new SystemException("Database error"));

            //Act and assert
            await Assert.ThrowsAsync<System.SystemException>(() => _requestManagement.AddNoteAsync(request));

        }
        [Fact]
        public async Task ExecuteUpdateAsync_ShouldReturn_DefaultResponse_On_NullResult()
        {
            //arange
            var parameter = new DynamicParameters();
            _mockDbService.Setup(d => d.QueryFirstOrDefaultAsync<CaseManagementResponseModel>(It.IsAny<string>(), It.IsAny<DynamicParameters>(), CommandType.StoredProcedure, null, null)).ReturnsAsync((CaseManagementResponseModel?)null);

            //Act 
            var result = await _requestManagement.ExecuteUpdateAsync(parameter);

            //Assert
            Assert.NotNull(result);
            Assert.True(result.IsSuccess);


        }
        [Fact]
        public async Task GetActivityAsync_should_Return_ValidResponse()
        {
            //arange
            string careCoordinationEpisodeId = "CC12345690";
            var expectedResponse = new List<CareCoordinationActivityResponseModel>();
            expectedResponse.Add(new CareCoordinationActivityResponseModel() {
                CareCoordinationEpisodeDate = DateTime.Now,
                CareCoordinationEpisodeId = "CC12345690",
                Comments = null,
                CreatedDate = DateTime.Now,
                CreatedBy = null,
                Id = 123456,
                RoleType = null,
                UserId = null
            });
            _mockDbService.Setup(d => d.QueryAsync<CareCoordinationActivityResponseModel>(It.IsAny<string>(), It.IsAny<DynamicParameters>(), CommandType.StoredProcedure, null, null)).ReturnsAsync(expectedResponse);
            //Act
            var result = await _requestManagement.GetActivityAsync(careCoordinationEpisodeId);
            //Assert
            Assert.NotNull(result);
            Assert.Equal(expectedResponse, result);
        }
        [Fact]
        public async Task GetActivityDataAsync_ShouldReturn_DefaultResponse_On_NullResult()
        {
            //arange
            var parameter = new DynamicParameters();
            List<CareCoordinationActivityResponseModel> res = new List<CareCoordinationActivityResponseModel>();
            _mockDbService.Setup(d => d.QueryAsync<CareCoordinationActivityResponseModel>(It.IsAny<string>(), It.IsAny<DynamicParameters>(), CommandType.StoredProcedure, null, null)).ReturnsAsync(res); 
            //Act 
            var result = await _requestManagement.GetActivityDataAsync(parameter);
            //Assert
            Assert.NotNull(result);
            _mockDbService.Verify(db => db.QueryAsync<CareCoordinationActivityResponseModel>(It.IsAny<string>(), parameter, CommandType.StoredProcedure, null, null), Times.Once);
        }
        [Fact]
        public async Task GetActivityDataAsync_ShouldReturn_Response()
        {
            //arange
            var parameter = new DynamicParameters();
            var res = new List<CareCoordinationActivityResponseModel>();
            res.Add(new CareCoordinationActivityResponseModel()
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
            _mockDbService.Setup(d => d.QueryAsync<CareCoordinationActivityResponseModel>(It.IsAny<string>(), It.IsAny<DynamicParameters>(), CommandType.StoredProcedure, null, null)).ReturnsAsync(res);
            //Act 
            var result = await _requestManagement.GetActivityDataAsync(parameter);
            //Assert
            Assert.NotNull(result);
            _mockDbService.Verify(db => db.QueryAsync<CareCoordinationActivityResponseModel>(It.IsAny<string>(), parameter, CommandType.StoredProcedure, null, null), Times.Once);
        }
        [Fact]
        public async Task GetActivityDataAsync_should_HandleException()
        {
            //arange
            var request = String.Empty;
            _mockDbService.Setup(d => d.QueryAsync<CareCoordinationActivityResponseModel>(It.IsAny<string>(), It.IsAny<DynamicParameters>(), CommandType.StoredProcedure, null, null)).ThrowsAsync(new SystemException("Database error"));

            //Act and assert
            await Assert.ThrowsAsync<System.SystemException>(() => _requestManagement.GetActivityAsync(request));

        }

    }
}
