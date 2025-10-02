using AutoMapper;
using Azure.Core;
using CareCoordination.Application.Abstracts.DALInterfaces;
using CareCoordination.Application.Abstracts.HandlerInterfaces;
using CareCoordination.Application.Handlers;
using CareCoordination.Application.Models;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace CareCoordination.Tests.ApplictaionHandlers
{
    public class DashboardViewManagementTest
    {
        private readonly Mock<IDashboardView> _mockDashboardView;
        
        private readonly DashboardViewManagement _dashboardViewManagement;

        public DashboardViewManagementTest()
        {
            _mockDashboardView = new Mock<IDashboardView>();
            _dashboardViewManagement = new DashboardViewManagement(_mockDashboardView.Object);
        }

        [Fact]
        public void Constructor_ThrowsArgumentNullException_WhenDashboardViewIsNull()
        {
            // Act & Assert
            Assert.Throws<ArgumentNullException>(() => new DashboardViewManagement(null!));
        }
        [Fact]
        public async Task GetDashboardDetails_ReturnsDashboardLoadResponseModel_WhenCalled()
        {
            // Arrange
            var request = new DashboardLoadRequestModel { UserName = "testuser", PageSize = 10, PageIndex = 1, IsFirstLoad = true, FilterDetails = new Dictionary<string, string>() };
            var response = new DashboardLoadResponseModel();
            _mockDashboardView.Setup(d => d.GetDashboardDetails(request)).ReturnsAsync(response);

            // Act
            var result = await _dashboardViewManagement.GetDashboardDetails(request);

            // Assert
            Assert.Equal(response, result);
            _mockDashboardView.Verify(d => d.GetDashboardDetails(request), Times.Once);
        }

        [Fact]
        public async Task GetDashboardDetails_ThrowsException_WhenDashboardViewThrowsException()
        {
            // Arrange
            var request = new DashboardLoadRequestModel { UserName = "testuser", PageSize = 10, PageIndex = 1, IsFirstLoad = true, FilterDetails = new Dictionary<string, string>() };
            _mockDashboardView.Setup(d => d.GetDashboardDetails(request)).ThrowsAsync(new System.Exception("Test exception"));

            // Act & Assert
            await Assert.ThrowsAsync<System.Exception>(() => _dashboardViewManagement.GetDashboardDetails(request));
        }

        [Fact]
        public async Task DashboardCaseAssignment_ShouldReturnResponseModel()
        {
            // Arrange
            var request = new DashboardCaseAssignmentRequestModel
            {
                CareCoordinationEpisodeIDs = new List<string> { "CC000000021", "CC000000022" },
                AssigneeName = "John.Doe"
            };
            var expectedResponse = new DashboardCaseAssignmentResponseModel
            {
                IsSuccess = true
            };

            _mockDashboardView.Setup(dv => dv.DashboardCaseAssignment(request))
                              .ReturnsAsync(expectedResponse);

            // Act
            var result = await _dashboardViewManagement.DashboardCaseAssignment(request);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(expectedResponse, result);
        }
        [Fact]
        public async Task GetAssigneeDetails_ReturnsExpectedResult()
        {
            string testUserName = "testuser";
            var response = new AssigneeDetailsResponse
            {
                AssigneeUser = new List<string> { "user1", "user2" },
                AssigneeName = new List<string> { "name1", "name2" },
                IsSuccess = true
            };
            _mockDashboardView.Setup(x=> x.GetAssigneeDetails(testUserName)).ReturnsAsync(response);

            // Act
            var result = await _dashboardViewManagement.GetAssigneeDetails(testUserName);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(response, result);


        }

        [Fact]
        public void Constructor_ShouldThrowArgumentNullException_WhenDashboardViewIsNull()
        {
            // Arrange & Act
            var exception = Assert.Throws<ArgumentNullException>(() => new DashboardViewManagement(null!));

            // Assert
            Assert.Equal("dashboardView", exception.ParamName);
        }
    }

}

