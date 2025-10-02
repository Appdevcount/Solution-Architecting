using CareCoordination.Application.Abstracts.DALInterfaces;
using CareCoordination.Application.Abstracts.ServiceInterfaces;
using CareCoordination.Application.Handlers;
using CareCoordination.Application.Models;
using CareCoordination.DAL.Implementation;
using Moq;
using Xunit;

namespace CareCoordination.Tests.ApplictaionHandlers
{
    public class PatientLookupManagementTest
    {
        private readonly Mock<IPatientLookupService> _memberLookupService;
        private readonly PatientLookupManagement _patientLookupManagement;
        private readonly Mock<IPatientRepository> _patientRepository;
        public PatientLookupManagementTest()
        {
            _memberLookupService = new Mock<IPatientLookupService>();
            _patientRepository = new Mock<IPatientRepository>();
             _patientLookupManagement= new PatientLookupManagement(_memberLookupService.Object,_patientRepository.Object);
        }
       
        [Fact]
        public async Task GetMemberDetails_ReturnPatientDetails()
        {
            //Arange
            var request = new PatientLookupRequestModel
            {
                RequestedBy = "User"
            };
            var expectedResponse = new List<PatientDetailsResponse>
            {
                new PatientDetailsResponse {
                    IsSuccess = true,
                    Response = new PatientResponseRecord
                    {
                        Patient = new Patients
                        {
                            PatientID = "Test Patient Id"
                        }
                    }
             
                }
            };
            _memberLookupService.Setup(s => s.GetMemberDetails(It.IsAny<PatientLookupRequestModel>())).ReturnsAsync(expectedResponse);
            _patientRepository.Setup(s=>s.IsRestrictedMember(It.IsAny<string>())).Returns(false);

            //Act
            var result = await _patientLookupManagement.GetMemberDetails(request);

            //Assert
            Assert.NotNull(result);
            Assert.Equal(expectedResponse, result);
            _memberLookupService.Verify(s => s.GetMemberDetails(It.IsAny<PatientLookupRequestModel>()), Times.Once);

        }
        [Fact]
        public async Task GetMemberEligibility_ReturnQualifiersDetails()
        {
            //Arange
            var request = new MemberEligibilityRequestModel
            {
                Qualifiers = new MemberEligibility
                {
                    ClientSystem = "ImageOne",
                    DOS = DateTime.Now,
                    InsCarrier = " Cigna",
                    PatientDOB = "25/01/1887",
                    PatientID = "A12345678",
                    PatientMemberCode = "1",
                    ReviewType = "Procedureeligibility",
                    Workflow = "CC",
                    CompanyID = "1",
                    JurisdictionState = "1",
                    CPLNTP = "1",
                    CPTCode = "1",
                    DMEBenefit = "1",
                    GroupNumber = "1",
                    Environment = "",
                    InsPlanType = "1",
                    Modality = "1",
                    PatientState = "1"
                }
            };
            var expectedResponse = new List<MemberEligibilityResponseModel>
            {
               new MemberEligibilityResponseModel()
                {
                   DOS = DateTime.Now,
                   CaseBuild ="",
                   CPLNTP ="",
                   CompanyID="1",
                   CPTCode="1",
                   InsCarrier="1",
                   MemberInScope = "1",
                   PlanTypeEligible = "1"
                }
            };
            _memberLookupService.Setup(s => s.GetMemberEligibility(It.IsAny<MemberEligibilityRequestModel>())).ReturnsAsync(expectedResponse);

            //Act
            var result = await _patientLookupManagement.GetMemberEligibility(request);

            //Assert
            Assert.NotNull(result);
            Assert.Equal(expectedResponse, result);
            _memberLookupService.Verify(s => s.GetMemberEligibility(It.IsAny<MemberEligibilityRequestModel>()), Times.Once);

        }
    }
}
