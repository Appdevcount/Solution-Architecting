using AutoMapper;
using CareCoordination.Api.Controllers;
using CareCoordination.Api.DTOs;
using CareCoordination.Application.Abstracts.DALInterfaces;
using CareCoordination.Application.Abstracts.HandlerInterfaces;
using CareCoordination.Application.Handlers;
using CareCoordination.Application.Logger;
using CareCoordination.Application.Models;
using CareCoordination.DAL.Implementation;
using CareCoordination.Domain.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using System.Net;
using Xunit;

namespace CareCoordination.Tests.Controllers
{
    public class RequestSearchControllerTests
    {
        private readonly Mock<IApplicationLogger> _logger;
        private readonly Mock<IMapper> _mapper;
        private readonly Mock<IRequestSearchManagement> _requestSearch;
        private readonly RequestSearchController _controller;

        public RequestSearchControllerTests()
        {
            //Arrange
            _logger = new Mock<IApplicationLogger>();
            _mapper = new Mock<IMapper>();
            _requestSearch = new Mock<IRequestSearchManagement>();
            _controller = new RequestSearchController(_logger.Object, _mapper.Object, _requestSearch.Object);
        }

        [Fact]
        public void Constructor_creates_instance()
        {
            Assert.IsAssignableFrom<RequestSearchController>(new RequestSearchController(_logger.Object, _mapper.Object, _requestSearch.Object));
        }

        [Fact]
        public async Task GetRequests_calls_return200()
        {
            //Arrange
            var SearchCareCoordinationRequestModel = new SearchCareCoordinationRequest()
            {
                Id = "1111",
                FirstName = "",
                LastName = "",
                DateOfBirth = "",
                Status = "All",
                UserName = "testuser"
            };

            //Act
            var actualResult = await _controller.GetRequests(SearchCareCoordinationRequestModel) as ObjectResult;
            //Assert
            Assert.NotNull(actualResult);
            Assert.Equal((int)HttpStatusCode.OK, actualResult.StatusCode);
        }

        [Fact]
        public async Task GetRequests_calls_returns400()
        {
            //Arrange
            SearchCareCoordinationRequest? SearchCareCoordinationRequestModel = new SearchCareCoordinationRequest() { Status = "All",UserName="testuser" };

            //Act
            var actualResult = await _controller.GetRequests(SearchCareCoordinationRequestModel) as ObjectResult;
            //Assert
            Assert.NotNull(actualResult);
            Assert.Equal((int)HttpStatusCode.BadRequest, actualResult.StatusCode);
        }

        [Fact]
        public async Task GetRequests_calls_invaliddateformat_returns400()
        {
            //Arrange
            SearchCareCoordinationRequest? SearchCareCoordinationRequestModel = new SearchCareCoordinationRequest()
            {
                DateOfBirth = "2025-01-01",
                Status = "All",
                UserName = "testuser"
            };

            //Act
            var actualResult = await _controller.GetRequests(SearchCareCoordinationRequestModel) as ObjectResult;
            //Assert
            Assert.NotNull(actualResult);
            Assert.Equal((int)HttpStatusCode.BadRequest, actualResult.StatusCode);
        }

        [Fact]
        public async Task GetRequests_calls_dateisempty_returns400()
        {
            //Arrange
            SearchCareCoordinationRequest? SearchCareCoordinationRequestModel = new SearchCareCoordinationRequest()
            {
                DateOfBirth = "",
                Status = "All",
                UserName = "Test"
            };

            //Act
            var actualResult = await _controller.GetRequests(SearchCareCoordinationRequestModel) as ObjectResult;
            //Assert
            Assert.NotNull(actualResult);
            Assert.Equal((int)HttpStatusCode.BadRequest, actualResult.StatusCode);
        }

        [Fact]
        public async Task GetRequests_whenMapperThrowsException_returns500()
        {
            //Arrange
            SearchCareCoordinationRequest? request = new SearchCareCoordinationRequest()
            {
                Id = "C1",
                Status = "All",
                UserName = "user"
            };

            _mapper.Setup(m => m.Map<GetCareCoordinationRequestModel>(It.IsAny<SearchCareCoordinationRequest>())).Throws(new Exception());

            //Act
            var actualResult = await _controller.GetRequests(request) as ObjectResult;

            //Assert
            Assert.Equal((int)HttpStatusCode.InternalServerError, actualResult?.StatusCode);

        }

        [Fact]
        public async Task GetRequestDetailsById_calls_return200()
        {
            //Arrange
            string Id = "CC00000001";

            //Act
            var actualResult = await _controller.GetRequestDetailsById(Id) as ObjectResult;
            //Assert
            Assert.NotNull(actualResult);
            Assert.Equal((int)HttpStatusCode.OK, actualResult.StatusCode);
        }

        [Fact]
        public async Task GetRequestDetailsById_calls_return400()
        {
            //Arrange
            string Id = "";

            //Act
            var actualResult = await _controller.GetRequestDetailsById(Id) as ObjectResult;
            //Assert
            Assert.NotNull(actualResult);
            Assert.Equal((int)HttpStatusCode.BadRequest, actualResult.StatusCode);
        }

        [Fact]
        public async Task GetRequestDetailsById_calls_return500()
        {
            //Arrange
            string Id = "C1";
            _requestSearch.Setup(m => m.GetRequestDetailsById(Id)).Throws(new Exception());
            //Act
            var actualResult = await _controller.GetRequestDetailsById(Id) as ObjectResult;

            //Assert
            Assert.Equal((int)HttpStatusCode.InternalServerError, actualResult?.StatusCode);
        }
    }
}
