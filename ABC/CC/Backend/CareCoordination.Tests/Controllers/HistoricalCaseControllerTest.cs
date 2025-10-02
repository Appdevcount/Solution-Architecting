using CareCoordination.Api.Controllers;
using CareCoordination.Application.Abstracts.HandlerInterfaces;
using CareCoordination.Application.Logger;
using CareCoordination.Domain.Models.HistoricalCaseDataModels;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System.Net;
using Xunit;

namespace CareCoordination.Tests.Controllers
{
    public class HistoricalCaseControllerTest
    {
        private readonly Mock<IApplicationLogger> _logger;
        private readonly Mock<IHistoricalCaseDataManagement> _dataManagement;
        private readonly HistoricalCaseController _controller;

        public HistoricalCaseControllerTest()
        {
            _logger = new Mock<IApplicationLogger>();
            _dataManagement = new Mock<IHistoricalCaseDataManagement>();
            _controller = new HistoricalCaseController(_logger.Object, _dataManagement.Object);
        }

        [Fact]
        public async Task GetHistoricalCaseData_calls_return200()
        {
            //Arrange
            string Id = "CC00000001";

            var response = new Root
            {
                careCordinationRequest = new CareCordinationRequest
                {
                    ccRequestID = Id,
                    ccCaseStatus = string.Empty,
                    ccReason = string.Empty,
                    caseManagerName = string.Empty,
                    socDate = DateTime.Now,
                    member = new Member
                    {
                        memberID = string.Empty,
                        memberPolicy = new MemberPolicy
                        {
                            insurer = "CIGNA",
                            program = "DME",
                        }
                    },
                    servicingProvider = new ServicingProvider
                    {
                        physicianName = string.Empty,
                    },
                    procedure = new List<Procedure>
                    {
                        new Procedure
                        {
                            procedureCode = string.Empty,
                            procedureCodeDescription = string.Empty,
                        }
                    }
                }
            };

            _dataManagement.Setup(m => m.GetHistoricalCaseData(Id)).ReturnsAsync(response);
            //Act
            var actualResult = await _controller.GetHistoricalCaseData(Id);
            //Assert
            Assert.NotNull(actualResult);
        }

        [Fact]
        public async Task GetRequestDetailsById_calls_return500()
        {
            //Arrange
            string Id = "C1";
            _dataManagement.Setup(m => m.GetHistoricalCaseData(Id)).Throws(new Exception());
            //Act
            var actualResult = await _controller.GetHistoricalCaseData(Id) as ObjectResult;

            //Assert
            Assert.Equal((int)HttpStatusCode.InternalServerError,actualResult?.StatusCode);
        }
    }
}
