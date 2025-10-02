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
    public class DashboardControllerTest
    {
        private readonly Mock<IApplicationLogger> _mockLogger;
        private readonly Mock<IMapper> _mockMapper;
        private readonly Mock<IDashboardViewManagement> _mockDashboardViewManagement;
        private readonly DashboardController _controller;

        public DashboardControllerTest()
        {
            _mockLogger = new Mock<IApplicationLogger>();
            _mockMapper = new Mock<IMapper>();
            _mockDashboardViewManagement = new Mock<IDashboardViewManagement>();
            _controller = new DashboardController(_mockLogger.Object, _mockMapper.Object, _mockDashboardViewManagement.Object);
        }

        [Fact]
        public void Constructor_ThrowsArgumentNullException_WhenDashboardViewManagementIsNull()
        {
            // Arrange
            var logger = new Mock<IApplicationLogger>().Object;
            var mapper = new Mock<IMapper>().Object;

            // Act & Assert
            Assert.Throws<ArgumentNullException>(() => new DashboardController(logger, mapper, null!));
        }

        [Fact]
        public async Task GetDashboardDetails_ReturnsBadRequest_WhenRequestIsNull()
        {
            // Arrange
            DashboardLoadRequest? request = null;

            // Act
            var result = await _controller.GetDashboardDetails(request);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal((int)HttpStatusCode.BadRequest, badRequestResult.StatusCode);
        }

        [Fact]
        public async Task GetDashboardDetails_ReturnsOk_WhenRequestIsValid()
        {
            // Arrange
            var request = new DashboardLoadRequest { UserName = "pooja.thakkar", PageSize = 3, PageIndex = 1, IsFirstLoad = true, FilterDetails = new Dictionary<string, string>() };
            var model = new DashboardLoadRequestModel { UserName = "pooja.thakkar", PageSize = 3, PageIndex = 1, IsFirstLoad = true, FilterDetails = new Dictionary<string, string>() };
            var response = new DashboardLoadResponseModel();
            _mockMapper.Setup(m => m.Map<DashboardLoadRequestModel>(request)).Returns(model);
            _mockDashboardViewManagement.Setup(d => d.GetDashboardDetails(model)).ReturnsAsync(response);

            // Act
            var result = await _controller.GetDashboardDetails(request);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal((int)HttpStatusCode.OK, okResult.StatusCode);
            Assert.Equal(response, okResult.Value);
        }

        [Fact]
        public async Task GetDashboardDetails_ReturnsInternalServerError_WhenExceptionThrown()
        {
            // Arrange
            var request = new DashboardLoadRequest { UserName = "pooja.thakkar", PageSize = 2, PageIndex = 1, IsFirstLoad = true, FilterDetails = new Dictionary<string, string>() };
            var model = new DashboardLoadRequestModel { UserName = "pooja.thakkar", PageSize = 2, PageIndex = 1, IsFirstLoad = true, FilterDetails = new Dictionary<string, string>() };
            _mockMapper.Setup(m => m.Map<DashboardLoadRequestModel>(request)).Returns(model);
            _mockDashboardViewManagement.Setup(d => d.GetDashboardDetails(model)).ThrowsAsync(new System.Exception("Test exception"));

            // Act
            var result = await _controller.GetDashboardDetails(request);

            // Assert
            var internalServerErrorResult = Assert.IsType<ObjectResult>(result);
            Assert.Equal((int)HttpStatusCode.InternalServerError, internalServerErrorResult.StatusCode);
        }
    }
}
