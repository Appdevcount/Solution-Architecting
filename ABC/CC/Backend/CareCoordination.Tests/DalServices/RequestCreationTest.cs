using AutoMapper;
using CareCoordination.Application.Abstracts.DALInterfaces;
using CareCoordination.Application.Models;
using CareCoordination.DAL.Implementation;
using CareCoordination.DAL.Mappers;
using CareCoordination.Domain.Models;
using Dapper;
using Moq;
using Moq.Dapper;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace CareCoordination.Tests.DalServices
{
    public class RequestCreationTest
    {
        private readonly Mock<IDbService> _mockDbService;
        private readonly RequestCreation _requestCreation;

        public RequestCreationTest()
        {
            _mockDbService = new Mock<IDbService>();
            _requestCreation = new RequestCreation(_mockDbService.Object);
        }

        [Fact]
        public async Task GetNextSequenceNo_ValidRequest_ReturnsMappedResults()
        {
            // Arrange
            var mockRequest = new CareCoordinationRequestModel
            {
                CompanyId = 1,
                HealthPlan = " Cigna",
                DateOfService = DateTime.UtcNow,
                EpisodeId = null,
                IsEscalated = false,
                StaffedRequest = true,
                SubServiceType = "Test",
                Notes = "others",
                PatientDetails = new PatientDetail
                {
                    ID = "123",
                    Name = "Test",
                    DOB = DateTime.UtcNow,
                    MemberCode = "1",
                    Addr1 = null,
                    Addr2 = null,
                    City = null,
                    State = null,
                    Zip = null,
                    Sex = null,
                    Phone = null,
                    OAOSubNo = null,
                    OAOPerNo = null,
                    OAOEmpNo = null,
                    GroupNumber = null,
                    PlanType = null,
                    LineOfBusiness = null,
                    Language = null,
                    PatientPlanType = null,
                    Entity = null,
                    Category = null,
                    IPA = null,
                    Ident = 123123,
                    Email = null,
                    CellPhone = null,
                    JurisdictionState = null,
                    TIT19 = null,
                    CaseFactor = 1,
                    PUSRDF = null,
                    FundType = null,
                    ERISA = null,
                    EXTID = null,
                    MemberStartDate = DateTime.UtcNow,
                    IsQuickCreate = false,
                    IsRestrictedMember = false
                },
                Reason = "other",
                Requestor = new Application.Models.Requestor
                {
                    Email = "asd",
                    FirstName = "Test",
                    LastName = "Test",
                    Extension = "Test",
                    Facility = "Test",
                    PhoneNumber = "12345",
                    Fax = "123456",
                }
            };
            int expectedSequece = 123;

            _mockDbService.Setup(c => c.QueryFirstOrDefaultAsync<int>("[CC_GetNextEpisodeID]", It.IsAny<object>(), CommandType.StoredProcedure, null, null))
                .ReturnsAsync(expectedSequece);

            // Act
            var result = await _requestCreation.GetNextSequenceNo(mockRequest);

            // Assert
            Assert.NotNull(result.EpisodeId);
        }

        [Fact]
        public async Task SaveCareCordinationRequest_ValidRequest_ReturnsResult()
        {
            // Arrange
            var mockRequest = new CareCoordinationRequestModel
            {
                CompanyId = 1,
                HealthPlan = " Cigna",
                DateOfService = DateTime.UtcNow,
                EpisodeId = null,
                IsEscalated = false,
                StaffedRequest = true,
                SubServiceType = "Test",
                Notes = "others",
                PatientDetails = new PatientDetail
                {
                    ID = "123",
                    Name = "Test",
                    DOB = DateTime.UtcNow,
                    MemberCode = "1",
                    Addr1 = null,
                    Addr2 = null,
                    City = null,
                    State = null,
                    Zip = null,
                    Sex = null,
                    Phone = null,
                    OAOSubNo = null,
                    OAOPerNo = null,
                    OAOEmpNo = null,
                    GroupNumber = null,
                    PlanType = null,
                    LineOfBusiness = null,
                    Language = null,
                    PatientPlanType = null,
                    Entity = null,
                    Category = null,
                    IPA = null,
                    Ident = 123123,
                    Email = null,
                    CellPhone = null,
                    JurisdictionState = null,
                    TIT19 = null,
                    CaseFactor = 1,
                    PUSRDF = null,
                    FundType = null,
                    ERISA = null,
                    EXTID = null,
                    MemberStartDate = DateTime.UtcNow,
                    IsQuickCreate = false,
                    IsRestrictedMember = false
                },
                Reason = "other",
                Requestor = new Application.Models.Requestor
                {
                    Email = "asd",
                    FirstName = "Test",
                    LastName = "Test",
                    Extension = "Test",
                    Facility = "Test",
                    PhoneNumber = "12345",
                    Fax = "123456",
                }
            };

            _mockDbService
                .Setup(c => c.ExecuteAsync("CreateCCRequest", It.IsAny<object>(), CommandType.StoredProcedure, null, null))
                .ReturnsAsync(1);

            // Act
            var result = await _requestCreation.SaveCareCordinationRequest(mockRequest);

            // Assert
            Assert.NotNull(result);
            Assert.True(result.IsSuccess);
            Assert.Null(result.Error);
        }

        [Fact]
        public async Task SaveCareCordinationRequest_whenThrowsexception_ReturnsError()
        {
            // Arrange
            var mockRequest = new CareCoordinationRequestModel
            {
                CompanyId = 1,
                HealthPlan = " Cigna",
                DateOfService = DateTime.UtcNow,
                EpisodeId = null,
                IsEscalated = false,
                StaffedRequest = true,
                SubServiceType = "Test",
                Notes = "others",
                PatientDetails = new PatientDetail
                {
                    ID = "123",
                    Name = "Test",
                    DOB = DateTime.UtcNow,
                    MemberCode = "1",
                    Addr1 = null,
                    Addr2 = null,
                    City = null,
                    State = null,
                    Zip = null,
                    Sex = null,
                    Phone = null,
                    OAOSubNo = null,
                    OAOPerNo = null,
                    OAOEmpNo = null,
                    GroupNumber = null,
                    PlanType = null,
                    LineOfBusiness = null,
                    Language = null,
                    PatientPlanType = null,
                    Entity = null,
                    Category = null,
                    IPA = null,
                    Ident = 123123,
                    Email = null,
                    CellPhone = null,
                    JurisdictionState = null,
                    TIT19 = null,
                    CaseFactor = 1,
                    PUSRDF = null,
                    FundType = null,
                    ERISA = null,
                    EXTID = null,
                    MemberStartDate = DateTime.UtcNow,
                    IsQuickCreate = false,
                    IsRestrictedMember = false
                },
                Reason = "other",
                Requestor = new Application.Models.Requestor
                {
                    Email = "asd",
                    FirstName = "Test",
                    LastName = "Test",
                    Extension = "Test",
                    Facility = "Test",
                    PhoneNumber = "12345",
                    Fax = "123456",
                }
            };

            _mockDbService
                .Setup(c => c.ExecuteAsync("CreateCCRequest", It.IsAny<object>(), CommandType.StoredProcedure, null, null))
                .ThrowsAsync(new Exception("Database Error"));

            // Act
            var exception = await Assert.ThrowsAsync<Exception>(() => _requestCreation.SaveCareCordinationRequest(mockRequest));

            // Assert
            Assert.Equal("Database Error", exception.Message);
        }
    }
}
