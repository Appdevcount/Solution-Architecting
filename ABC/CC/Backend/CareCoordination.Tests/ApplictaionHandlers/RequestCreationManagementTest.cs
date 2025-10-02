using CareCoordination.Application.Abstracts.DALInterfaces;
using CareCoordination.Application.Handlers;
using CareCoordination.Application.Models;
using Moq;
using Xunit;

namespace CareCoordination.Tests.ApplictaionHandlers
{
    public class RequestCreationManagementTest
    {
        private readonly Mock<IRequestCreate> _requestCreate;
        private readonly RequestCreationManagement _requestCreationManagement;
        public RequestCreationManagementTest() 
        {
            _requestCreate = new Mock<IRequestCreate>();
            _requestCreationManagement = new RequestCreationManagement(_requestCreate.Object);
        }

        [Fact]
        public async Task GetNextSequenceNo_shouldReturn_ValidSequence()
        {
            //arange
            var request = new CareCoordinationRequestModel
            {
                CompanyId = 1,
                HealthPlan = " Cigna",
                DateOfService = DateTime.UtcNow,
                EpisodeId = "1234",
                IsEscalated = false,
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
                    MemberStartDate = DateTime.UtcNow
                },
                Reason = "other",
                Requestor = new Requestor
                {
                    Email ="asd",
                    FirstName = "Test",
                    LastName = "Test",
                    Extension = "Test",
                    Facility = "Test",
                    PhoneNumber = "12345",
                    Fax = "123456",
                }
            };
             var expectedResponse = new CareCoordinationRequestModel
             {
                 CompanyId = 1,
                 HealthPlan = " Cigna",
                 DateOfService = DateTime.UtcNow,
                 EpisodeId = "1234",
                 IsEscalated = false,
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
                     MemberStartDate = DateTime.UtcNow
                 },
                 Reason = "other",
                 Requestor = new Requestor
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

            _requestCreate.Setup(s => s.GetNextSequenceNo(It.IsAny<CareCoordinationRequestModel>())).ReturnsAsync(expectedResponse);

            //Act
            var result = await _requestCreationManagement.GetNextSequenceNo(request);

            //Assert
            Assert.NotNull(result);
            Assert.Equal(expectedResponse, result);

            _requestCreate.Verify(s=>s.GetNextSequenceNo(It.IsAny<CareCoordinationRequestModel>()),Times.Once);

        }

        [Fact]
        public async Task SaveCarecoordinationRequest_ShouldReturn_Response()
        {
            //arange
            var request = new CareCoordinationRequestModel {
                CompanyId = 1,
                HealthPlan = " Cigna",
                DateOfService = DateTime.UtcNow,
                EpisodeId = "1234",
                IsEscalated = false,
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
                    MemberStartDate = DateTime.UtcNow
                },
                Reason = "other",
                Requestor = new Requestor
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
            var expectedResponse = new CareCoordinationResponseModel
            {
                EpisodeId = "CC000000026",
                IsSuccess = true,
            };
            _requestCreate.Setup(s => s.SaveCareCordinationRequest(It.IsAny<CareCoordinationRequestModel>())).ReturnsAsync(expectedResponse);

            //act
            var result = await _requestCreationManagement.SaveCareCordinationRequest(request);

            //assert
            Assert.NotNull(result);
            Assert.Equal(expectedResponse, result);

            _requestCreate.Verify(s=>s.SaveCareCordinationRequest(It.IsAny<CareCoordinationRequestModel>()),Times.Once);
        }
    }
}
