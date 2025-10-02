using CareCoordination.Application.Abstracts.HandlerInterfaces;
using CareCoordination.Application.Abstracts.ServiceInterfaces;
using CareCoordination.Application.Handlers;
using CareCoordination.Application.Models;
using CareCoordination.Domain.Models.HistoricalCaseDataModels;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace CareCoordination.Tests.ApplictaionHandlers
{
    public class HistoricalCaseDataManagementTests
    {
        public readonly Mock<IHistoricalCaseDataService> _mockHistoricalCaseDataManagement;
        public readonly HistoricalCaseDataManagement _historicalCaseDataManagement;

        public HistoricalCaseDataManagementTests() 
        {
            _mockHistoricalCaseDataManagement = new Mock<IHistoricalCaseDataService>();
            _historicalCaseDataManagement = new HistoricalCaseDataManagement(_mockHistoricalCaseDataManagement.Object);
        }

        [Fact]
        public async Task GetHistoricalCaseData_ReturnCaseDetails()
        {
            //Arrange
            string Id = "CC00000001";

            var response = new Root
            {
                careCordinationRequest = new CareCordinationRequest {
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

            _mockHistoricalCaseDataManagement.Setup(s => s.GetHistoricalCaseData(It.IsAny<String>())).ReturnsAsync(response);

            //Act
            var result = await _historicalCaseDataManagement.GetHistoricalCaseData(Id);

            //Assert
            Assert.NotNull(result);
        }
    }
}
