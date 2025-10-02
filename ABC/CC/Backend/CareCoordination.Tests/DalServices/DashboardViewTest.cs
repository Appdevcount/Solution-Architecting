using AutoMapper;
using CareCoordination.Application.Abstracts.DALInterfaces;
using CareCoordination.Application.Models;
using CareCoordination.DAL.Implementation;
using CareCoordination.Domain.Models;
using Dapper;
using Moq;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace CareCoordination.Tests.DalServices
{
    public class DashboardViewTests
    {
        private readonly Mock<IDbService> _mockDbService;
        private readonly Mock<IGridReaderWrapper> _mockGridReaderWrapper;
        private readonly DashboardView _dashboardView;

        public DashboardViewTests()
        {
            _mockDbService = new Mock<IDbService>();
            _mockGridReaderWrapper = new Mock<IGridReaderWrapper>();
            _dashboardView = new DashboardView(_mockDbService.Object);
        }


        [Fact]
        public async Task GetDashboardDetails_ShouldReturnDashboardDetails_WhenRequestIsValid()
        {
            // Arrange
            var request = new DashboardLoadRequestModel
            {
                UserName = "testUser",
                PageSize = 10,
                PageIndex = 1,
                IsFirstLoad = true,
                FilterDetails = new Dictionary<string, string> { { "key", "value" } }
            };

            var dashboardDetails = new List<DashboardDetail>
    {
        new DashboardDetail { CareCoordinationEpisodeID = "CC000000028" }
    };


            _mockGridReaderWrapper.Setup(m => m.ReadAsync<DashboardDetail>(true)).ReturnsAsync(dashboardDetails);
            _mockGridReaderWrapper.Setup(m => m.ReadSingleOrDefaultAsync<int>()).ReturnsAsync(1);

            _mockDbService.Setup(m => m.QueryMultipleAsync(It.IsAny<string>(), It.IsAny<object>(), It.IsAny<CommandType>(), It.IsAny<IDbTransaction>(), It.IsAny<int?>()))
        .ReturnsAsync(_mockGridReaderWrapper.Object);
            // Act
            var result = await _dashboardView.GetDashboardDetails(request);

            // Assert
            Assert.True(result.IsSuccess);
            Assert.NotNull(result.DashboardDetails);
            Assert.Single(result.DashboardDetails);
            Assert.NotNull(result.DashboardCounts);
            Assert.Equal(1, result.DashboardCounts.CasesOpen);
        }

        [Fact]
        public async Task GetDashboardDetails_ShouldReturnError_WhenExceptionIsThrown()
        {
            // Arrange
            var request = new DashboardLoadRequestModel();
            _mockDbService.Setup(m => m.QueryMultipleAsync(It.IsAny<string>(), It.IsAny<object>(), It.IsAny<CommandType>(), It.IsAny<IDbTransaction>(), It.IsAny<int?>()))
                .ThrowsAsync(new System.Exception("Test exception"));

            // Act
            var result = await _dashboardView.GetDashboardDetails(request);

            // Assert
            Assert.False(result.IsSuccess);
            Assert.Equal("Test exception", result.Error);
        }

        [Fact]
        public async Task DashboardCaseAssignment_ShouldReturnSuccessResponse()
        {
            // Arrange
            var request = new DashboardCaseAssignmentRequestModel
            {
                CareCoordinationEpisodeIDs = new List<string> { "CC000000027", "CC000000028" },
                AssigneeName = "John.Doe"
            };
            var parameters = new DynamicParameters();
            parameters.Add("@EpisodeIDList", It.IsAny<DataTable>(), DbType.Object);
            parameters.Add("@AssigneeName", request.AssigneeName, DbType.String);

            _mockDbService.Setup(db => db.ExecuteAsync("CC_CaseAssignment", It.IsAny<object>(), CommandType.StoredProcedure, null, null))
                          .ReturnsAsync(1);

            // Act
            var result = await _dashboardView.DashboardCaseAssignment(request);

            // Assert
            Assert.True(result.IsSuccess);
            Assert.Null(result.Error);
        }

        [Fact]
        public async Task DashboardCaseAssignment_ShouldReturnErrorResponse_OnException()
        {
            // Arrange
            var request = new DashboardCaseAssignmentRequestModel
            {
                CareCoordinationEpisodeIDs = new List<string> { "CC000000027", "CC000000028" },
                AssigneeName = "John.Doe"
            };
            var parameters = new DynamicParameters();
            parameters.Add("@EpisodeIDList", It.IsAny<DataTable>(), DbType.Object);
            parameters.Add("@AssigneeName", request.AssigneeName, DbType.String);

            _mockDbService.Setup(db => db.ExecuteAsync("CC_CaseAssignment", It.IsAny<object>(), CommandType.StoredProcedure, null, null))
                          .ThrowsAsync(new Exception("Test exception"));

            // Act
            var exception = await Assert.ThrowsAsync<Exception>(() => _dashboardView.DashboardCaseAssignment(request));

            // Assert
            Assert.Equal("Test exception", exception.Message);
        }
        [Fact]
        public async Task GetAssigneeDetails_ShouldReturnError_WhenExceptionIsThrown()
        {
            // Arrange
            var request = "";
            _mockDbService.Setup(m => m.QueryAsync<AssigneeDetailsResponseModel>("CC_GetAssigneeDetails", It.IsAny<object>(), CommandType.StoredProcedure, null, null))
                .ThrowsAsync(new Exception("Test exception"));
            var exception = await Assert.ThrowsAsync<Exception>(() => _dashboardView.GetAssigneeDetails(request));


            // Assert
            
            Assert.Equal("Test exception", exception.Message);
        }

        [Fact]
        public async Task GetAssigneeDetails_ShouldReturnAssignmentDetails_WhenRequestIsValid()
        {
            // Arrange
            var request = "TestUser";
            var dbResponse = new List<AssigneeDetailsResponseModel>
    {
        new AssigneeDetailsResponseModel {AssigneeUser = "User1",AssigneeName="Name 1"},
        new AssigneeDetailsResponseModel {AssigneeUser = "User2",AssigneeName="Name 2"}
    };

            _mockDbService.Setup(m => m.QueryAsync<AssigneeDetailsResponseModel>(It.IsAny<string>(), It.IsAny<object>(), It.IsAny<CommandType>(), It.IsAny<IDbTransaction>(), It.IsAny<int?>()))
        .ReturnsAsync(dbResponse);
            // Act
            var result = await _dashboardView.GetAssigneeDetails(request);

            // Assert
            Assert.True(result.IsSuccess);
            Assert.Equal("User1", result.AssigneeUser?[0]);
            Assert.Equal("Name 1", result.AssigneeName?[0]);
        }




    }
}


