using AutoMapper;
using CareCoordination.Api.Controllers;
using CareCoordination.Api.DTOs;
using CareCoordination.Application.Abstracts.DALInterfaces;
using CareCoordination.Application.Abstracts.HandlerInterfaces;
using CareCoordination.Application.Logger;
using CareCoordination.Application.Models;
using CareCoordination.Domain.Models;
using CareCoordination.Domain.Validators;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace CareCoordination.Tests.Controllers
{
    public class RequestCreationControllerTest
    {
        private readonly Mock<IApplicationLogger> _logger;
        private readonly Mock<IRequestCreationManagement> _requestCreate;
        private readonly Mock<IMapper> _mapper;
        private readonly RequestCreationController _controller;
        public RequestCreationControllerTest()
        {
            _logger = new Mock<IApplicationLogger>();
            _mapper = new Mock<IMapper>();
            _requestCreate = new Mock<IRequestCreationManagement>();
            _controller = new RequestCreationController(_logger.Object, _mapper.Object, _requestCreate.Object);

        }

        [Fact]
        public void Constructor_creates_instance()
        {
            Assert.IsAssignableFrom<RequestCreationController>(new RequestCreationController(_logger.Object, _mapper.Object, _requestCreate.Object));
        }
        [Fact]
        public void Constructor_ThrowsArgumentNullException_WhenRequestCreationManagementIsNull()
        {

            // Act & Assert
            Assert.Throws<ArgumentNullException>(() => new RequestCreationController(_logger.Object, _mapper.Object, null!));
        }


        [Fact]
        public async Task SaveCareCordinationRequest_ReturnBadRequest_WhenHealthPlanisEmpty()
        {
            //Arrange
            var request = new CareCoordinationRequest()
            {
                HealthPlan = "",
                Reason = "other",
                Notes = "test",
                EpisodeId = "1",
                CompanyId = 1,
                DateOfService = DateTime.Now,
                IsEscalated = false,
                StaffedRequest = true,
                SubServiceType = "Test",
                PatientDetails = new Api.DTOs.PatientDetails
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
                Requestor = new Api.DTOs.Requestor
                {
                    Email = "asd",
                    FirstName = "Test",
                    LastName = "Test",
                    Extension = "Test",
                    Facility = "Test",
                    PhoneNumber = "12345",
                    Fax = "123456"
                }
            };
            var model = new CareCoordinationDomainModel()
            {
                Requestor = new Domain.Models.Requestor()
                {
                    Email = "asd",
                    FirstName = "Test",
                    LastName = "Test",
                    Extension = "Test",
                    Facility = "Test",
                    PhoneNumber = "12345",
                    Fax = "123456"
                },
                HealthPlan = "",
                Reason = "other",
                CompanyId = 1,
                Notes = "Test",
                DateOfService = DateTime.UtcNow,
                IsEscalated = false,
                StaffedRequest = true,
                SubServiceType = "Test",
                EpisodeId = "",
                PatientDetails = new Domain.Models.PatientDetails()
                {
                    ID = "11111",
                    Name = "Test",
                    Addr1 = "",
                    Addr2 = "",
                    City = null,
                    State = null,
                    Zip = null,
                    Sex = null,
                    Phone = null,
                    DOB = DateTime.Now,
                    OAOSubNo = null,
                    OAOPerNo = null,
                    OAOEmpNo = null,
                    MemberCode = null,
                    GroupNumber = null,
                    PlanType = null,
                    LineOfBusiness = null,
                    Language = null,
                    PatientPlanType = null,
                    Entity = null,
                    Category = null,
                    IPA = null,
                    Ident = 12342321,
                    Email = null,
                    CellPhone = null,
                    JurisdictionState = null,
                    TIT19 = null,
                    CaseFactor = 1,
                    PUSRDF = null,
                    FundType = null,
                    ERISA = null,
                    EXTID = null,
                    MemberStartDate = null,
                    IsQuickCreate = false
                }
            };
            _mapper.Setup(m => m.Map<CareCoordinationDomainModel>(It.IsAny<CareCoordinationRequest>())).Returns(model);


            //Act
            var result = await _controller.SaveCareCordinationRequest(request);

            //Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal(400, badRequestResult.StatusCode);
        }

        [Fact]
        public async Task SaveCareCordinationRequest_ReturnBadRequest_WhenReasonisEmpty()
        {
            //Arrange
            var request = new CareCoordinationRequest()
            {
                HealthPlan = "",
                Reason = "other",
                Notes = "test",
                EpisodeId = "1",
                CompanyId = 1,
                DateOfService = DateTime.Now,
                IsEscalated = false,
                StaffedRequest = true,
                SubServiceType = "Test",
                PatientDetails = new Api.DTOs.PatientDetails
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
                Requestor = new Api.DTOs.Requestor
                {
                    Email = "asd",
                    FirstName = "Test",
                    LastName = "Test",
                    Extension = "Test",
                    Facility = "Test",
                    PhoneNumber = "12345",
                    Fax = "123456"
                }
            };
            var model = new CareCoordinationDomainModel()
            {
                Requestor = new Domain.Models.Requestor()
                {
                    Email = "asd",
                    FirstName = "Test",
                    LastName = "Test",
                    Extension = "Test",
                    Facility = "Test",
                    PhoneNumber = "12345",
                    Fax = "123456"
                },
                HealthPlan = "Cigna",
                Reason = "",
                CompanyId = 1,
                Notes = "Test",
                DateOfService = DateTime.UtcNow,
                IsEscalated = false,
                StaffedRequest = true,
                SubServiceType = "Test",
                EpisodeId = "",
                PatientDetails = new Domain.Models.PatientDetails()
                {
                    ID = "11111",
                    Name = "Test",
                    Addr1 = "",
                    Addr2 = "",
                    City = null,
                    State = null,
                    Zip = null,
                    Sex = null,
                    Phone = null,
                    DOB = DateTime.Now,
                    OAOSubNo = null,
                    OAOPerNo = null,
                    OAOEmpNo = null,
                    MemberCode = null,
                    GroupNumber = null,
                    PlanType = null,
                    LineOfBusiness = null,
                    Language = null,
                    PatientPlanType = null,
                    Entity = null,
                    Category = null,
                    IPA = null,
                    Ident = 12342321,
                    Email = null,
                    CellPhone = null,
                    JurisdictionState = null,
                    TIT19 = null,
                    CaseFactor = 1,
                    PUSRDF = null,
                    FundType = null,
                    ERISA = null,
                    EXTID = null,
                    MemberStartDate = null,
                    IsQuickCreate = false
                }

            };
            _mapper.Setup(m => m.Map<CareCoordinationDomainModel>(It.IsAny<CareCoordinationRequest>())).Returns(model);


            //Act
            var result = await _controller.SaveCareCordinationRequest(request);

            //Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal(400, badRequestResult.StatusCode);
        }

        [Fact]
        public async Task GetMemberDetails_ReturnSuccess()
        {
            //Arrange
            var request = new CareCoordinationRequest()
            {
                HealthPlan = "Cigna",
                Reason = "other",
                Notes = "test",
                EpisodeId = "1",
                CompanyId = 1,
                DateOfService = DateTime.Now,
                IsEscalated = false,
                StaffedRequest = true,
                SubServiceType = "Test",
                PatientDetails = new Api.DTOs.PatientDetails
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
                Requestor = new Api.DTOs.Requestor
                {
                    Email = "asd",
                    FirstName = "Test",
                    LastName = "Test",
                    Extension = "Test",
                    Facility = "Test",
                    PhoneNumber = "12345",
                    Fax = "123456"
                }
            };
            var entity = new CareCoordinationDomainModel()
            {
                Requestor = new Domain.Models.Requestor()
                {
                    Email = "asd",
                    FirstName = "Test",
                    LastName = "Test",
                    Extension = "Test",
                    Facility = "Test",
                    PhoneNumber = "12345",
                    Fax = "123456"
                },
                HealthPlan = "Cigna",
                Reason = "other",
                CompanyId = 1,
                Notes = "Test",
                DateOfService = DateTime.UtcNow,
                IsEscalated = false,
                StaffedRequest = true,
                SubServiceType = "Test",
                EpisodeId = "",
                PatientDetails = new Domain.Models.PatientDetails()
                {
                    ID = "11111",
                    Name = "Test",
                    Addr1 = "",
                    Addr2 = "",
                    City = null,
                    State = null,
                    Zip = null,
                    Sex = null,
                    Phone = null,
                    DOB = DateTime.Now,
                    OAOSubNo = null,
                    OAOPerNo = null,
                    OAOEmpNo = null,
                    MemberCode = null,
                    GroupNumber = null,
                    PlanType = null,
                    LineOfBusiness = null,
                    Language = null,
                    PatientPlanType = null,
                    Entity = null,
                    Category = null,
                    IPA = null,
                    Ident = 12342321,
                    Email = null,
                    CellPhone = null,
                    JurisdictionState = null,
                    TIT19 = null,
                    CaseFactor = 1,
                    PUSRDF = null,
                    FundType = null,
                    ERISA = null,
                    EXTID = null,
                    MemberStartDate = null,
                    IsQuickCreate = false,
                }

            };
            var response = new CareCoordinationResponseModel()
            {
                EpisodeId = "CC000000026",
                IsSuccess = true
            };

            _mapper.Setup(m => m.Map<CareCoordinationDomainModel>(It.IsAny<CareCoordinationRequest>())).Returns(entity);
            _requestCreate.Setup(x => x.SaveCareCordinationRequest(It.IsAny<CareCoordinationRequestModel>())).ReturnsAsync(response);

            //Act
            var result = await _controller.SaveCareCordinationRequest(request);

            //Assert
            var okObjectResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(200, okObjectResult.StatusCode);

        }
        [Fact]
        public async Task GetMemberDetails_ReturnBadRequest_WhenResponseisFails()
        {
            //Arrange
            var request = new CareCoordinationRequest()
            {
                HealthPlan = "Cigna",
                Reason = "other",
                Notes = "test",
                EpisodeId = "1",
                CompanyId = 1,
                DateOfService = DateTime.Now,
                IsEscalated = false,
                StaffedRequest = true,
                SubServiceType = "Test",
                PatientDetails = new Api.DTOs.PatientDetails
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
                Requestor = new Api.DTOs.Requestor
                {
                    Email = "asd",
                    FirstName = "Test",
                    LastName = "Test",
                    Extension = "Test",
                    Facility = "Test",
                    PhoneNumber = "12345",
                    Fax = "123456"
                }
            };
            var entity = new CareCoordinationDomainModel()
            {
                Requestor = new Domain.Models.Requestor()
                {
                    Email = "asd",
                    FirstName = "Test",
                    LastName = "Test",
                    Extension = "Test",
                    Facility = "Test",
                    PhoneNumber = "12345",
                    Fax = "123456"
                },
                HealthPlan = "Cigna",
                Reason = "other",
                CompanyId = 1,
                Notes = "Test",
                DateOfService = DateTime.UtcNow,
                IsEscalated = false,
                StaffedRequest = true,
                SubServiceType = "Test",
                EpisodeId = "",
                PatientDetails = new Domain.Models.PatientDetails()
                {
                    ID = "11111",
                    Name = "Test",
                    Addr1 = "",
                    Addr2 = "",
                    City = null,
                    State = null,
                    Zip = null,
                    Sex = null,
                    Phone = null,
                    DOB = DateTime.Now,
                    OAOSubNo = null,
                    OAOPerNo = null,
                    OAOEmpNo = null,
                    MemberCode = null,
                    GroupNumber = null,
                    PlanType = null,
                    LineOfBusiness = null,
                    Language = null,
                    PatientPlanType = null,
                    Entity = null,
                    Category = null,
                    IPA = null,
                    Ident = 12342321,
                    Email = null,
                    CellPhone = null,
                    JurisdictionState = null,
                    TIT19 = null,
                    CaseFactor = 1,
                    PUSRDF = null,
                    FundType = null,
                    ERISA = null,
                    EXTID = null,
                    MemberStartDate = null,
                    IsQuickCreate = false,
                }

            };
            var response = new CareCoordinationResponseModel()
            {

                IsSuccess = false
            };

            _mapper.Setup(m => m.Map<CareCoordinationDomainModel>(It.IsAny<CareCoordinationRequest>())).Returns(entity);
            _requestCreate.Setup(x => x.SaveCareCordinationRequest(It.IsAny<CareCoordinationRequestModel>())).ReturnsAsync(response);

            //Act
            var result = await _controller.SaveCareCordinationRequest(request);

            //Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal(400, badRequestResult.StatusCode);

        }
        [Fact]
        public async Task GetMemberDetails_InternalServerError_whenMapperThrowsException()
        {
            //Arrange
            var request = new CareCoordinationRequest()
            {
                HealthPlan = "Cigna",
                Reason = "other",
                Notes = "test",
                EpisodeId = "1",
                CompanyId = 1,
                DateOfService = DateTime.Now,
                IsEscalated = false,
                StaffedRequest = true,
                SubServiceType = "Test",
                PatientDetails = new Api.DTOs.PatientDetails
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
                Requestor = new Api.DTOs.Requestor
                {
                    Email = "asd",
                    FirstName = "Test",
                    LastName = "Test",
                    Extension = "Test",
                    Facility = "Test",
                    PhoneNumber = "12345",
                    Fax = "123456"
                }
            };

            _mapper.Setup(m => m.Map<CareCoordinationDomainModel>(It.IsAny<CareCoordinationRequest>())).Throws(new Exception());

            //Act
            var result = await _controller.SaveCareCordinationRequest(request);

            //Assert
            Assert.NotNull(result);
        }
        [Fact]
        public async Task SaveCareCoordinationRequest_ValidateRequest()
        {
            var request = new CareCoordinationRequest()
            {
                HealthPlan = "Cigna",
                Reason = "other",
                Notes = "test",
                EpisodeId = "1",
                CompanyId = 1,
                DateOfService = DateTime.Now,
                IsEscalated = false,
                StaffedRequest = true,
                SubServiceType = "Test",
                PatientDetails = new Api.DTOs.PatientDetails
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
                    IsQuickCreate = true,
                    IsRestrictedMember = false
                },
                Requestor = new Api.DTOs.Requestor
                {
                    Email = "asd",
                    FirstName = "Test",
                    LastName = "Test",
                    Extension = "Test",
                    Facility = "Test",
                    PhoneNumber = "12345",
                    Fax = "123456"
                }
            };
            var entity = new CareCoordinationDomainModel()
            {
                Requestor = new Domain.Models.Requestor()
                {
                    Email = "asd",
                    FirstName = "Test",
                    LastName = "Test",
                    Extension = "Test",
                    Facility = "Test",
                    PhoneNumber = "12345",
                    Fax = "123456"
                },
                HealthPlan = "Cigna",
                Reason = "other",
                CompanyId = 1,
                Notes = "Test",
                DateOfService = DateTime.UtcNow,
                IsEscalated = false,
                StaffedRequest = true,
                SubServiceType = "Test",
                EpisodeId = "",
                PatientDetails = new Domain.Models.PatientDetails()
                {
                    ID = "11111",
                    Name = "Test",
                    Addr1 = "",
                    Addr2 = "",
                    City = null,
                    State = null,
                    Zip = null,
                    Sex = null,
                    Phone = null,
                    DOB = DateTime.Now,
                    OAOSubNo = null,
                    OAOPerNo = null,
                    OAOEmpNo = null,
                    MemberCode = null,
                    GroupNumber = null,
                    PlanType = null,
                    LineOfBusiness = null,
                    Language = null,
                    PatientPlanType = null,
                    Entity = null,
                    Category = null,
                    IPA = null,
                    Ident = 12342321,
                    Email = null,
                    CellPhone = null,
                    JurisdictionState = null,
                    TIT19 = null,
                    CaseFactor = 1,
                    PUSRDF = null,
                    FundType = null,
                    ERISA = null,
                    EXTID = null,
                    MemberStartDate = null,
                    IsQuickCreate = true,
                }

            };
            _mapper.Setup(m => m.Map<CareCoordinationDomainModel>(It.IsAny<CareCoordinationRequest>())).Returns(entity);
            
                var result = await _controller.SaveCareCordinationRequest(request);
                Assert.NotNull(result);
                
              
        }

    }
}

