using AutoMapper;
using CareCoordination.Application.Abstracts.DALInterfaces;
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
    public class RequestViewLookupManagementTest
    {
        private readonly Mock<IProcedureCodeSearchAndUpdate> _reqViewDetailsMock;
        private readonly RequestViewLookupManagement _handler;

        public RequestViewLookupManagementTest()
        {
            _reqViewDetailsMock = new Mock<IProcedureCodeSearchAndUpdate>();
            var mapperMock = new Mock<IMapper>();
            _handler = new RequestViewLookupManagement(_reqViewDetailsMock.Object, mapperMock.Object);
        }

        [Fact]
        public async Task GetProcedureCodes_ReturnsExpectedResult()
        {
            // Arrange
            var request = new ProcedureCodeSearchRequestModel
            {
                InsCarrier = "Cigna",
                CompanyID = 8,
                ProcedureCodeIDorDesc = "95"
            };
            var expectedResponse = new ProcedureCodeSearchResponseModel { IsSuccess = true };
            _reqViewDetailsMock.Setup(x => x.GetProcedureCodes(It.IsAny<ProcedureCodeSearchRequestModel>()))
                               .ReturnsAsync(expectedResponse);

            // Act
            var result = await _handler.GetProcedureCodes(request);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(expectedResponse, result);
            _reqViewDetailsMock.Verify(x => x.GetProcedureCodes(request), Times.Once);
        }

        [Fact]
        public async Task AddProcedureCode_ReturnsExpectedResult()
        {
            // Arrange
            var request = new ProcedureCodeAddOrRemoveRequestModel
            {
                EpisodeID = "CC000000026",
                ProcedureCode = "95782",
                ProcedureDesc = "Polysomnography",
                PrivateDutyNurse = true,
                CustomNeed = true
            };
            var expectedResponse = new ProcedureCodeAddOrRemoveResponseModel { IsSuccess = true };
            _reqViewDetailsMock.Setup(x => x.AddProcedureCode(It.IsAny<ProcedureCodeAddOrRemoveRequestModel>()))
                               .ReturnsAsync(expectedResponse);

            // Act
            var result = await _handler.AddProcedureCode(request);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(expectedResponse, result);
            _reqViewDetailsMock.Verify(x => x.AddProcedureCode(request), Times.Once);
        }

        [Fact]
        public async Task RemoveProcedureCode_ReturnsExpectedResult()
        {
            // Arrange
            var request = new ProcedureCodeAddOrRemoveRequestModel
            {
                EpisodeID = "CC000000026",
                ProcedureCode = "95782",
                ProcedureDesc = "Polysomnography",
                PrivateDutyNurse = true,
                CustomNeed = true
            };
            var expectedResponse = new ProcedureCodeAddOrRemoveResponseModel { IsSuccess = true };
            _reqViewDetailsMock.Setup(x => x.RemoveProcedureCode(It.IsAny<ProcedureCodeAddOrRemoveRequestModel>()))
                               .ReturnsAsync(expectedResponse);

            // Act
            var result = await _handler.RemoveProcedureCode(request);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(expectedResponse, result);
            _reqViewDetailsMock.Verify(x => x.RemoveProcedureCode(request), Times.Once);
        }
    }
}
