using AutoMapper;
using CareCoordination.Api.Controllers;
using CareCoordination.Api.DTOs;
using CareCoordination.Application.Abstracts.HandlerInterfaces;
using CareCoordination.Application.Logger;
using CareCoordination.Application.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace CareCoordination.Tests.Controllers
{
    public class DashboardViewControllerTest
    {
        private readonly Mock<IApplicationLogger> _mockLogger;
        private readonly Mock<IMapper> _mockMapper;
        private readonly Mock<IDashboardViewManagement> _mockDashboardViewManagement;
        private readonly DashboardController _controller;

        public DashboardViewControllerTest()
        {
            _mockLogger = new Mock<IApplicationLogger>();
            _mockMapper = new Mock<IMapper>();
            _mockDashboardViewManagement = new Mock<IDashboardViewManagement>();
            _controller = new DashboardController(_mockLogger.Object, _mockMapper.Object, _mockDashboardViewManagement.Object);
        }

        [Fact]
        public async Task DashboardCaseAssignment_ShouldReturnOkResult_WithResponseModel()
        {
            // Arrange
            var request = new DashboardCaseAssignmentRequest
            {
                CareCoordinationEpisodeIDs = new List<string> { "CC000000021", "CC000000022" },
                AssigneeName = "John.Doe"
            };
            var responseModel = new DashboardCaseAssignmentResponseModel
            {
                IsSuccess = true
            };
            var requestModel = new DashboardCaseAssignmentRequestModel
            {
                CareCoordinationEpisodeIDs = new List<string> { "CC000000021", "CC000000022" },
                AssigneeName = "John.Doe"
            };

            _mockMapper.Setup(m => m.Map<DashboardCaseAssignmentRequestModel>(request)).Returns(requestModel);
            _mockDashboardViewManagement.Setup(dvm => dvm.DashboardCaseAssignment(requestModel)).ReturnsAsync(responseModel);

            // Act
            var result = await _controller.DashboardCaseAssignment(request);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal((int)HttpStatusCode.OK, okResult.StatusCode);
            Assert.Equal(responseModel, okResult.Value);
        }

        [Fact]
        public async Task DashboardCaseAssignment_ShouldReturnBadRequest_WhenRequestIsNull()
        {
            // Act
            var result = await _controller.DashboardCaseAssignment(null!);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal((int)HttpStatusCode.BadRequest, badRequestResult.StatusCode);
        }

        [Fact]
        public async Task DashboardCaseAssignment_ShouldReturnInternalServerError_OnException()
        {
            // Arrange
            var request = new DashboardCaseAssignmentRequest
            {
                CareCoordinationEpisodeIDs = new List<string> { "CC000000021", "CC000000022" },
                AssigneeName = "John.Doe"
            };
            var requestModel = new DashboardCaseAssignmentRequestModel
            {
                CareCoordinationEpisodeIDs = new List<string> { "CC000000021", "CC000000022" },
                AssigneeName = "John.Doe"
            };

            _mockMapper.Setup(m => m.Map<DashboardCaseAssignmentRequestModel>(request)).Returns(requestModel);
            _mockDashboardViewManagement.Setup(dvm => dvm.DashboardCaseAssignment(requestModel)).ThrowsAsync(new Exception("Test exception"));

            // Act
            var result = await _controller.DashboardCaseAssignment(request);

            // Assert
            var statusCodeResult = Assert.IsType<ObjectResult>(result);
            Assert.Equal((int)HttpStatusCode.InternalServerError, statusCodeResult.StatusCode);
        }

        [Fact]
        public async Task GetAssigneeDetails_ShouldReturnBadRequest_WhenRequestIsNull()
        {
            // Act
            var result = await _controller.GetAssigneeDetails(null!);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal((int)HttpStatusCode.BadRequest, badRequestResult.StatusCode);
        }

        [Fact]
        public async Task GetAssigneeDetails_ShouldReturnInternalServerError_OnException()
        {
            // Arrange
            string userName = "John.Doe";


            _mockDashboardViewManagement.Setup(dvm => dvm.GetAssigneeDetails(userName)).ThrowsAsync(new Exception("Test exception"));

            // Act
            var result = await _controller.GetAssigneeDetails(userName);

            // Assert
            var statusCodeResult = Assert.IsType<ObjectResult>(result);
            Assert.Equal((int)HttpStatusCode.InternalServerError, statusCodeResult.StatusCode);
        }

        [Fact]
        public async Task GetAssigneeDetails_ShouldReturnOkResult_WithResponseModel()
        {
            // Arrange
            string userName = "John.Doe";

            var responseModel = new AssigneeDetailsResponse
            {
                AssigneeName = new List<string> { "Name1", "Name1" },
                AssigneeUser = new List<string> { "User1", "User2" },
                IsSuccess = true
            };

            _mockDashboardViewManagement.Setup(dvm => dvm.GetAssigneeDetails(userName)).ReturnsAsync(responseModel);

            // Act
            var result = await _controller.GetAssigneeDetails(userName);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal((int)HttpStatusCode.OK, okResult.StatusCode);
            Assert.Equal(responseModel, okResult.Value);
        }

    }
}
