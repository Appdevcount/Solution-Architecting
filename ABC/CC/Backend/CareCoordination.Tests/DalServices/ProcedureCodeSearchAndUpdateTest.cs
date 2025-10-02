using AutoMapper;
using CareCoordination.Application.Abstracts.DALInterfaces;
using CareCoordination.Application.Models;
using CareCoordination.DAL.Implementation;
using CareCoordination.Domain.Models;
using Dapper;
using Moq.Dapper;
using Moq;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace CareCoordination.Tests.DalServices
{
    public class ProcedureCodeSearchAndUpdateTest
    {
        private readonly Mock<IDbService> _mockDbService;
        private readonly Mock<IMapper> _mockMapper;
        private readonly ProcedureCodeSearchAndUpdate _service;

        public ProcedureCodeSearchAndUpdateTest()
        {
            _mockDbService = new Mock<IDbService>();
            _mockMapper = new Mock<IMapper>();
            _service = new ProcedureCodeSearchAndUpdate(_mockMapper.Object, _mockDbService.Object);
        }

        [Fact]
        public async Task GetProcedureCodes_ValidRequest_ReturnsExpectedResult()
        {
            // Arrange
            var mockRequest = new ProcedureCodeSearchRequestModel
            {
                InsCarrier = "Cigna",
                CompanyID = 8,
                ProcedureCodeIDorDesc = "95"
            };

            var expectedEntities = new List<ProcedureCodeSearchResponseEntity>
            {
                new ProcedureCodeSearchResponseEntity { ProcedureCode = "Code1", ProcedureDesc = "Description1" },
                new ProcedureCodeSearchResponseEntity { ProcedureCode = "Code2", ProcedureDesc = "Description2" }
            };

            var expectedResult = new List<ProcedureCodeDetails>
            {
                new ProcedureCodeDetails { ProcedureCode = "Code1", ProcedureDesc = "Description1" },
                new ProcedureCodeDetails { ProcedureCode = "Code2", ProcedureDesc = "Description2" }
            };

            _mockDbService.Setup(c => c.QueryAsync<ProcedureCodeSearchResponseEntity>(
                It.IsAny<String>(), It.IsAny<object>(), CommandType.StoredProcedure, null, null))
                .ReturnsAsync(expectedEntities);

            _mockMapper.Setup(m => m.Map<List<ProcedureCodeDetails>>(It.IsAny<List<ProcedureCodeSearchResponseEntity>>()))
                       .Returns(expectedResult);

            // Act
            var result = await _service.GetProcedureCodes(mockRequest);

            // Assert
            Assert.NotNull(result);
            Assert.True(result.IsSuccess);
            Assert.Equal(expectedResult, result.ProcedureCodeDetails);
        }

        [Fact]
        public async Task AddProcedureCode_ValidRequest_ReturnsSuccess()
        {
            // Arrange
            var mockRequest = new ProcedureCodeAddOrRemoveRequestModel
            {
                EpisodeID = "CC000000026",
                ProcedureCode = "95782",
                ProcedureDesc = "Polysomnography",
                PrivateDutyNurse = true,
                CustomNeed = true
            };

            _mockDbService.Setup(c => c.ExecuteAsync(
                "CC_AddProcedureCodes", It.IsAny<object>(),  CommandType.StoredProcedure, null, null))
                .ReturnsAsync(1);

            // Act
            var result = await _service.AddProcedureCode(mockRequest);

            // Assert
            Assert.NotNull(result);
            Assert.True(result.IsSuccess);
        }

        [Fact]
        public async Task RemoveProcedureCode_ValidRequest_ReturnsSuccess()
        {
            // Arrange
            var mockRequest = new ProcedureCodeAddOrRemoveRequestModel
            {
                EpisodeID = "CC000000026",
                ProcedureCode = "95782",
                ProcedureDesc = "Polysomnography",
                PrivateDutyNurse = true,
                CustomNeed = true
            };

            _mockDbService.Setup(c => c.ExecuteAsync(
                "CC_RemoveProcedureCodes", It.IsAny<object>(),  CommandType.StoredProcedure, null, null))
                .ReturnsAsync(1);

            // Act
            var result = await _service.RemoveProcedureCode(mockRequest);

            // Assert
            Assert.NotNull(result);
            Assert.True(result.IsSuccess);
        }

        [Fact]
        public async Task GetProcedureCodes_WhenThrowsException_ReturnsErrorResponse()
        {
            // Arrange
            var mockRequest = new ProcedureCodeSearchRequestModel
            {
                InsCarrier = "Cigna",
                CompanyID = 8,
                ProcedureCodeIDorDesc = "95"
            };

            _mockDbService.Setup(c => c.QueryAsync<ProcedureCodeSearchResponseEntity>(
                It.IsAny<String>(), It.IsAny<object>(),  CommandType.StoredProcedure, null, null))
                .ThrowsAsync(new Exception("Database Error"));

            // Act
            var exception = await Assert.ThrowsAsync<Exception>(() => _service.GetProcedureCodes(mockRequest));

            // Assert
            Assert.Equal("Database Error", exception.Message);
        }




        [Fact]
        public async Task GetProcedureCodes_WhenThrowsException_ReturnsErrorResponse_WhenInsCarrierIsNull_AndProcedureCodeIDorDescIsNull()
        {
            // Arrange
            var mockRequest = new ProcedureCodeSearchRequestModel
            {
                InsCarrier = null,
                CompanyID = 8,
                ProcedureCodeIDorDesc = null
            };

            _mockDbService.Setup(c => c.QueryAsync<ProcedureCodeSearchResponseEntity>(
                It.IsAny<String>(), It.IsAny<object>(), CommandType.StoredProcedure, null, null))
                .ThrowsAsync(new Exception("Database Error"));

            // Act
            var exception = await Assert.ThrowsAsync<Exception>(() => _service.GetProcedureCodes(mockRequest));

            // Assert
            Assert.Equal("Database Error", exception.Message);
        }

        [Fact]
        public async Task GetProcedureCodes_WhenThrowsException_ReturnsErrorResponse_WhenInsCarrierIsNull_AndProcedureCodeIDorDescIsNotNull()
        {
            // Arrange
            var mockRequest = new ProcedureCodeSearchRequestModel
            {
                InsCarrier = null,
                CompanyID = 8,
                ProcedureCodeIDorDesc = "95"
            };

            _mockDbService.Setup(c => c.QueryAsync<ProcedureCodeSearchResponseEntity>(
                It.IsAny<String>(), It.IsAny<object>(), CommandType.StoredProcedure, null, null))
                .ThrowsAsync(new Exception("Database Error"));

            // Act
            var exception = await Assert.ThrowsAsync<Exception>(() => _service.GetProcedureCodes(mockRequest));

            // Assert
            Assert.Equal("Database Error", exception.Message);
        }

        [Fact]
        public async Task GetProcedureCodes_WhenThrowsException_ReturnsErrorResponse_WhenInsCarrierIsNotNull_AndProcedureCodeIDorDescIsNull()
        {
            // Arrange
            var mockRequest = new ProcedureCodeSearchRequestModel
            {
                InsCarrier = "Cigna",
                CompanyID = 8,
                ProcedureCodeIDorDesc = null
            };

            _mockDbService.Setup(c => c.QueryAsync<ProcedureCodeSearchResponseEntity>(
                It.IsAny<String>(), It.IsAny<object>(), CommandType.StoredProcedure, null, null))
                .ThrowsAsync(new Exception("Database Error"));

            // Act
            var exception = await Assert.ThrowsAsync<Exception>(() => _service.GetProcedureCodes(mockRequest));

            // Assert
            Assert.Equal("Database Error", exception.Message);
        }


        [Fact]
        public async Task GetProcedureCodes_WhenThrowsException_ReturnsErrorResponse_WhenProcedureCodeIDorDescIsEmpty()
        {
            // Arrange
            var mockRequest = new ProcedureCodeSearchRequestModel
            {
                InsCarrier = "Cigna",
                CompanyID = 8,
                ProcedureCodeIDorDesc = ""
            };

            _mockDbService.Setup(c => c.QueryAsync<ProcedureCodeSearchResponseEntity>(
                It.IsAny<String>(), It.IsAny<object>(), CommandType.StoredProcedure, null, null))
                .ThrowsAsync(new Exception("Database Error"));

            // Act
            var exception = await Assert.ThrowsAsync<Exception>(() => _service.GetProcedureCodes(mockRequest));

            // Assert
            Assert.Equal("Database Error", exception.Message);
        }


        [Fact]
        public async Task GetProcedureCodes_WhenThrowsException_ReturnsErrorResponse_WhenInsCarrierIsEmpty()
        {
            // Arrange
            var mockRequest = new ProcedureCodeSearchRequestModel
            {
                InsCarrier = "",
                CompanyID = 8,
                ProcedureCodeIDorDesc = "95"
            };

            _mockDbService.Setup(c => c.QueryAsync<ProcedureCodeSearchResponseEntity>(
                It.IsAny<String>(), It.IsAny<object>(), CommandType.StoredProcedure, null, null))
                .ThrowsAsync(new Exception("Database Error"));

            // Act
            var exception = await Assert.ThrowsAsync<Exception>(() => _service.GetProcedureCodes(mockRequest));

            // Assert
            Assert.Equal("Database Error", exception.Message);
        }



        [Fact]
        public async Task AddProcedureCode_WhenThrowsException_ReturnsErrorResponse()
        {
            // Arrange
            var mockRequest = new ProcedureCodeAddOrRemoveRequestModel
            {
                EpisodeID = "EpisodeID",
                ProcedureCode = "ProcedureCode",
                ProcedureDesc = "ProcedureDesc",
                PrivateDutyNurse = null,
                CustomNeed = false
            };

            _mockDbService.Setup(c => c.ExecuteAsync(
                "CC_AddProcedureCodes", It.IsAny<object>(),CommandType.StoredProcedure,null, null))
                .ThrowsAsync(new Exception("Database Error"));

            // Act
            var exception = await Assert.ThrowsAsync<Exception>(() => _service.AddProcedureCode(mockRequest));

            // Assert
            Assert.Equal("Database Error", exception.Message);
        }

        [Fact]
        public async Task RemoveProcedureCode_WhenThrowsException_ReturnsErrorResponse()
        {
            // Arrange
            var mockRequest = new ProcedureCodeAddOrRemoveRequestModel
            {
                EpisodeID = "CC000000026",
                ProcedureCode = "95782",
                ProcedureDesc = "Polysomnography",
                PrivateDutyNurse = null,
                CustomNeed = true
            };

            _mockDbService.Setup(c => c.ExecuteAsync(
                "CC_RemoveProcedureCodes", It.IsAny<object>(), CommandType.StoredProcedure,null, null))
                .ThrowsAsync(new Exception("Database Error"));

            // Act
            var exception = await Assert.ThrowsAsync<Exception>(() => _service.RemoveProcedureCode(mockRequest));

            // Assert
            Assert.Equal("Database Error", exception.Message);
        }




        [Fact]
        public async Task AddProcedureCode_ValidRequest_WherePrivateDutyNurseIsNull_AndCustomNeedIsNull()
        {
            // Arrange
            var mockRequest = new ProcedureCodeAddOrRemoveRequestModel
            {
                EpisodeID = "CC000000026",
                ProcedureCode = "95782",
                ProcedureDesc = "Polysomnography",
                PrivateDutyNurse = null,
                CustomNeed = null
            };

            _mockDbService.Setup(c => c.ExecuteAsync(
                "CC_AddProcedureCodes", It.IsAny<object>(), CommandType.StoredProcedure, null, null))
                .ReturnsAsync(1);

            // Act
            var result = await _service.AddProcedureCode(mockRequest);

            // Assert
            Assert.NotNull(result);
            Assert.True(result.IsSuccess);
        }

        [Fact]
        public async Task AddProcedureCode_ValidRequest_WherePrivateDutyNurseIsTrue_AndCustomNeedIsFalse()
        {
            // Arrange
            var mockRequest = new ProcedureCodeAddOrRemoveRequestModel
            {
                EpisodeID = "CC000000026",
                ProcedureCode = "95782",
                ProcedureDesc = "Polysomnography",
                PrivateDutyNurse = true,
                CustomNeed = false
            };

            _mockDbService.Setup(c => c.ExecuteAsync(
                "CC_AddProcedureCodes", It.IsAny<object>(), CommandType.StoredProcedure, null, null))
                .ReturnsAsync(1);

            // Act
            var result = await _service.AddProcedureCode(mockRequest);

            // Assert
            Assert.NotNull(result);
            Assert.True(result.IsSuccess);
        }

        [Fact]
        public async Task AddProcedureCode_ValidRequest_WherePrivateDutyNurseIsFalse_AndCustomNeedIsTrue()
        {
            // Arrange
            var mockRequest = new ProcedureCodeAddOrRemoveRequestModel
            {
                EpisodeID = "CC000000026",
                ProcedureCode = "95782",
                ProcedureDesc = "Polysomnography",
                PrivateDutyNurse = false,
                CustomNeed = true
            };

            _mockDbService.Setup(c => c.ExecuteAsync(
                "CC_AddProcedureCodes", It.IsAny<object>(), CommandType.StoredProcedure, null, null))
                .ReturnsAsync(1);

            // Act
            var result = await _service.AddProcedureCode(mockRequest);

            // Assert
            Assert.NotNull(result);
            Assert.True(result.IsSuccess);
        }

        [Fact]
        public async Task AddProcedureCode_ValidRequest_WherePrivateDutyNurseIsNull_AndCustomNeedIsFalse()
        {
            // Arrange
            var mockRequest = new ProcedureCodeAddOrRemoveRequestModel
            {
                EpisodeID = "CC000000026",
                ProcedureCode = "95782",
                ProcedureDesc = "Polysomnography",
                PrivateDutyNurse = null,
                CustomNeed = false
            };

            _mockDbService.Setup(c => c.ExecuteAsync(
                "CC_AddProcedureCodes", It.IsAny<object>(), CommandType.StoredProcedure, null, null))
                .ReturnsAsync(1);

            // Act
            var result = await _service.AddProcedureCode(mockRequest);

            // Assert
            Assert.NotNull(result);
            Assert.True(result.IsSuccess);
        }

        [Fact]
        public async Task AddProcedureCode_WhenThrowsException_WherePrivateDutyNurseIsNull_AndCustomNeedIsTrue()
        {
            // Arrange
            var mockRequest = new ProcedureCodeAddOrRemoveRequestModel
            {
                EpisodeID = "EpisodeID",
                ProcedureCode = "ProcedureCode",
                ProcedureDesc = "ProcedureDesc",
                PrivateDutyNurse = null,
                CustomNeed = true
            };

            _mockDbService.Setup(c => c.ExecuteAsync(
                "CC_AddProcedureCodes", It.IsAny<object>(), CommandType.StoredProcedure, null, null))
                .ThrowsAsync(new Exception("Database Error"));

            // Act
            var exception = await Assert.ThrowsAsync<Exception>(() => _service.AddProcedureCode(mockRequest));

            // Assert
            Assert.Equal("Database Error", exception.Message);
        }

        [Fact]
        public async Task AddProcedureCode_WhenThrowsException_WherePrivateDutyNurseIsTrue_AndCustomNeedIsNull()
        {
            // Arrange
            var mockRequest = new ProcedureCodeAddOrRemoveRequestModel
            {
                EpisodeID = "EpisodeID",
                ProcedureCode = "ProcedureCode",
                ProcedureDesc = "ProcedureDesc",
                PrivateDutyNurse = true,
                CustomNeed = null
            };

            _mockDbService.Setup(c => c.ExecuteAsync(
                "CC_AddProcedureCodes", It.IsAny<object>(), CommandType.StoredProcedure, null, null))
                .ThrowsAsync(new Exception("Database Error"));

            // Act
            var exception = await Assert.ThrowsAsync<Exception>(() => _service.AddProcedureCode(mockRequest));

            // Assert
            Assert.Equal("Database Error", exception.Message);
        }

        [Fact]
        public async Task AddProcedureCode_WhenThrowsException_WherePrivateDutyNurseIsFalse_AndCustomNeedIsNull()
        {
            // Arrange
            var mockRequest = new ProcedureCodeAddOrRemoveRequestModel
            {
                EpisodeID = "EpisodeID",
                ProcedureCode = "ProcedureCode",
                ProcedureDesc = "ProcedureDesc",
                PrivateDutyNurse = false,
                CustomNeed = null
            };

            _mockDbService.Setup(c => c.ExecuteAsync(
                "CC_AddProcedureCodes", It.IsAny<object>(), CommandType.StoredProcedure, null, null))
                .ThrowsAsync(new Exception("Database Error"));

            // Act
            var exception = await Assert.ThrowsAsync<Exception>(() => _service.AddProcedureCode(mockRequest));

            // Assert
            Assert.Equal("Database Error", exception.Message);
        }



        [Fact]
        public async Task RemoveProcedureCode_ValidRequest_WhenRequestParameterIsNull()
        {
            // Arrange
            var mockRequest = new ProcedureCodeAddOrRemoveRequestModel
            {

            };

            _mockDbService.Setup(c => c.ExecuteAsync(
                "CC_RemoveProcedureCodes", It.IsAny<object>(), CommandType.StoredProcedure, null, null))
                .ReturnsAsync(1);

            // Act
            var result = await _service.RemoveProcedureCode(mockRequest);

            // Assert
            Assert.NotNull(result);
            Assert.True(result.IsSuccess);
        }

        [Fact]
        public async Task RemoveProcedureCode_ValidRequest_WherePrivateDutyNurseIsFalse_AndCustomNeedIsNull()
        {
            // Arrange
            var mockRequest = new ProcedureCodeAddOrRemoveRequestModel
            {
                EpisodeID = "CC000000026",
                ProcedureCode = "95782",
                ProcedureDesc = "Polysomnography",
                PrivateDutyNurse = false,
                CustomNeed = null
            };

            _mockDbService.Setup(c => c.ExecuteAsync(
                "CC_RemoveProcedureCodes", It.IsAny<object>(), CommandType.StoredProcedure, null, null))
                .ReturnsAsync(1);

            // Act
            var result = await _service.RemoveProcedureCode(mockRequest);

            // Assert
            Assert.NotNull(result);
            Assert.True(result.IsSuccess);
        }

        [Fact]
        public async Task RemoveProcedureCode_ValidRequest_WherePrivateDutyNurseIsFalse_AndCustomNeedIsTrue()
        {
            // Arrange
            var mockRequest = new ProcedureCodeAddOrRemoveRequestModel
            {
                EpisodeID = "CC000000026",
                ProcedureCode = "95782",
                ProcedureDesc = "Polysomnography",
                PrivateDutyNurse = false,
                CustomNeed = true
            };

            _mockDbService.Setup(c => c.ExecuteAsync(
                "CC_RemoveProcedureCodes", It.IsAny<object>(), CommandType.StoredProcedure, null, null))
                .ReturnsAsync(1);

            // Act
            var result = await _service.RemoveProcedureCode(mockRequest);

            // Assert
            Assert.NotNull(result);
            Assert.True(result.IsSuccess);
        }

        [Fact]
        public async Task RemoveProcedureCode_ValidRequest_WherePrivateDutyNurseIsNull_AndCustomNeedIsNull()
        {
            // Arrange
            var mockRequest = new ProcedureCodeAddOrRemoveRequestModel
            {
                EpisodeID = "CC000000026",
                ProcedureCode = "95782",
                ProcedureDesc = "Polysomnography",
                PrivateDutyNurse = null,
                CustomNeed = null
            };

            _mockDbService.Setup(c => c.ExecuteAsync(
                "CC_RemoveProcedureCodes", It.IsAny<object>(), CommandType.StoredProcedure, null, null))
                .ReturnsAsync(1);

            // Act
            var result = await _service.RemoveProcedureCode(mockRequest);

            // Assert
            Assert.NotNull(result);
            Assert.True(result.IsSuccess);
        }

        [Fact]
        public async Task RemoveProcedureCode_ValidRequest_WherePrivateDutyNurseIsTrue_AndCustomNeedIsNull()
        {
            // Arrange
            var mockRequest = new ProcedureCodeAddOrRemoveRequestModel
            {
                EpisodeID = "CC000000026",
                ProcedureCode = "95782",
                ProcedureDesc = "Polysomnography",
                PrivateDutyNurse = true,
                CustomNeed = null
            };

            _mockDbService.Setup(c => c.ExecuteAsync(
                "CC_RemoveProcedureCodes", It.IsAny<object>(), CommandType.StoredProcedure, null, null))
                .ReturnsAsync(1);

            // Act
            var result = await _service.RemoveProcedureCode(mockRequest);

            // Assert
            Assert.NotNull(result);
            Assert.True(result.IsSuccess);
        }

        [Fact]
        public async Task RemoveProcedureCode_WhenThrowsException_WherePrivateDutyNurseIsNull_AndCustomNeedIsTrue()
        {
            // Arrange
            var mockRequest = new ProcedureCodeAddOrRemoveRequestModel
            {
                EpisodeID = "CC000000026",
                ProcedureCode = "95782",
                ProcedureDesc = "Polysomnography",
                PrivateDutyNurse = null,
                CustomNeed = true
            };

            _mockDbService.Setup(c => c.ExecuteAsync(
                "CC_RemoveProcedureCodes", It.IsAny<object>(), CommandType.StoredProcedure, null, null))
                .ThrowsAsync(new Exception("Database Error"));

            // Act
            var exception = await Assert.ThrowsAsync<Exception>(() => _service.RemoveProcedureCode(mockRequest));

            // Assert
            Assert.Equal("Database Error", exception.Message);
        }

        [Fact]
        public void CreateRequest_WithValidRequest_ReturnsExceptedParameters()
        {
            // Arrange
            var mockRequest = new ProcedureCodeAddOrRemoveRequestModel
            {
                EpisodeID = "CC000000026",
                ProcedureCode = "95782",
                ProcedureDesc = "Polysomnography",
                PrivateDutyNurse = true,
                CustomNeed = false
            };
            // Act
            var result = ProcedureCodeSearchAndUpdate.CreateParameters(mockRequest);
            // Assert
            Assert.Equal("CC000000026",result.Get<string>("@EpisodeID"));
            Assert.Equal("95782", result.Get<string>("@ProcedureCode"));
            Assert.Equal("Polysomnography", result.Get<string>("@ProcedureDesc"));
            Assert.True(result.Get<bool>("@PrivateDutyNurse"));
            Assert.False(result.Get<bool>("@CustomNeed"));
        }

        [Fact]
        public void CreateRequest_WithNullRequest_SetsAllParamsToDbNull()
        {
            // Act
            var result = ProcedureCodeSearchAndUpdate.CreateParameters(null);
            // Assert
            Assert.Null(result.Get<object>("@EpisodeID"));
            Assert.Null(result.Get<object>("@ProcedureCode"));
            Assert.Null(result.Get<object>("@ProcedureDesc"));
            Assert.Null(result.Get<object>("@PrivateDutyNurse"));
            Assert.Null(result.Get<object>("@CustomNeed"));
        }

    }
}
