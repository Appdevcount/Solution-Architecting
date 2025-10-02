using AutoMapper;
using Azure;
using CareCoordination.Api.Controllers;
using CareCoordination.Api.DTOs;
using CareCoordination.Application.Abstracts.HandlerInterfaces;
using CareCoordination.Application.Logger;
using CareCoordination.Application.Models;
using CareCoordination.Application.Models.SiteRequestModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Moq;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Xunit;

namespace CareCoordination.Tests.Controllers
{
    public class LookupControllerTest
    {
        private readonly Mock<IApplicationLogger> _logger;
        private readonly Mock<IMapper> _mapper;
        private readonly Mock<IPatientLookupManagement> _patientLookup;
        private readonly Mock<ISiteLookupManagement> _siteLookupManagement;
        private readonly LookupController _controller;
        private readonly Mock<IHttpClientFactory> _httpClientFactoryMock;

        public LookupControllerTest()
        {
            //Arrange
            _logger = new Mock<IApplicationLogger>();
            _mapper = new Mock<IMapper>();
            _patientLookup = new Mock<IPatientLookupManagement>();
            _siteLookupManagement = new Mock<ISiteLookupManagement>();
            _httpClientFactoryMock = new Mock<IHttpClientFactory>();
            _controller = new LookupController(_logger.Object,_mapper.Object,_patientLookup.Object,_siteLookupManagement.Object);
        }

        [Fact]
        public void Constructor_creates_instance()
        {
            Assert.IsAssignableFrom<LookupController>(new LookupController(_logger.Object,_mapper.Object,_patientLookup.Object,_siteLookupManagement.Object));
        }

        [Fact]
        public async Task GetMemberDetails_ReturnBadRequest_WhenPatientIdisEmpty()
        {
            //Arrange
            var request = new PatientLookupRequest()
            {
                PatientID = "",
                PatientDob = "09011998",
                PatientLastName = "John",
                Carrier = "cigna",
                DOS = "12345678",
                CompanyId = "1",
                Counter = "1",
                CPTcode = "1",
                PatientFirstName = "john",
                PatientGroupNumber = "1",
                PatientState = "xyz",
                Plan1 = "1",
                Plan2 = "2",
                ProviderNPI = "2567",
                RequestedBy = "wer"
            };

            //Act
            var result = await _controller.GetMemberDetails(request);

            //Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal(400,badRequestResult.StatusCode);
        }

        [Fact]
        public async Task GetMemberDetails_ReturnBadRequest_WhenPatientLastNameisEmpty()
        {
            //Arrange
            var request = new PatientLookupRequest()
            {
                PatientID = "11111",
                PatientDob = "09011998",
                PatientLastName = "",
                Carrier = "cigna",
                DOS = "12345678",
                CompanyId = "1",
                Counter = "1",
                CPTcode = "1",
                PatientFirstName = "john",
                PatientGroupNumber = "1",
                PatientState = "xyz",
                Plan1 = "1",
                Plan2 = "2",
                ProviderNPI = "2567",
                RequestedBy = "wer"
            };

            //Act
            var result = await _controller.GetMemberDetails(request);

            //Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal(400,badRequestResult.StatusCode);
        }
        [Fact]
        public async Task GetMemberDetails_ReturnBadRequest_WhenPatientDOBisEmpty()
        {
            //Arrange
            var request = new PatientLookupRequest()
            {
                PatientID = "11111",
                PatientDob = "",
                PatientLastName = "John",
                Carrier = "cigna",
                DOS = "12345678",
                CompanyId = "1",
                Counter = "1",
                CPTcode = "1",
                PatientFirstName = "john",
                PatientGroupNumber = "1",
                PatientState = "xyz",
                Plan1 = "1",
                Plan2 = "2",
                ProviderNPI = "2567",
                RequestedBy = "wer"
            };

            //Act
            var result = await _controller.GetMemberDetails(request);

            //Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal(400,badRequestResult.StatusCode);
        }

        [Fact]
        public async Task GetMemberDetails_ReturnSuccess()
        {
            //Arrange
            var request = new PatientLookupRequest()
            {
                PatientID = "11111",
                PatientDob = "09011998",
                PatientLastName = "John",
                Carrier = "cigna",
                DOS = "12345678",
                CompanyId = "1",
                Counter = "1",
                CPTcode = "1",
                PatientFirstName = "john",
                PatientGroupNumber = "1",
                PatientState = "xyz",
                Plan1 = "1",
                Plan2 = "2",
                ProviderNPI = "2567",
                RequestedBy = "wer"
            };

            var response = new List<PatientDetailsResponse>()
                {
                    new PatientDetailsResponse()
                    {
                        IsSuccess = true,
                    }
                };

            _patientLookup.Setup(x => x.GetMemberDetails(It.IsAny<PatientLookupRequestModel>())).ReturnsAsync(response);

            //Act
            var result = await _controller.GetMemberDetails(request);

            //Assert
            var okObjectResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(200,okObjectResult.StatusCode);

        }
        [Fact]
        public async Task GetMemberDetails_ReturnBadRequest_WhenResponseisFails()
        {
            //Arrange
            var request = new PatientLookupRequest()
            {
                PatientID = "11111",
                PatientDob = "09011998",
                PatientLastName = "John",
                Carrier = "cigna",
                DOS = "12345678",
                CompanyId = "1",
                Counter = "1",
                CPTcode = "1",
                PatientFirstName = "john",
                PatientGroupNumber = "1",
                PatientState = "xyz",
                Plan1 = "1",
                Plan2 = "2",
                ProviderNPI = "2567",
                RequestedBy = "wer"
            };

            var response = new List<PatientDetailsResponse>()
                {
                    new PatientDetailsResponse()
                    {
                        IsSuccess = false,
                    }
                };

            _patientLookup.Setup(x => x.GetMemberDetails(It.IsAny<PatientLookupRequestModel>())).ReturnsAsync(response);

            //Act
            var result = await _controller.GetMemberDetails(request);

            //Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal(400,badRequestResult.StatusCode);

        }

        [Fact]
        public async Task GetMemberDetails_InternalServerError_whenThrowsException()
        {
            //Arrange
            var request = new PatientLookupRequest()
            {
                PatientID = "11111",
                PatientDob = "09011998",
                PatientLastName = "John",
                Carrier = "cigna",
                DOS = "12345678",
                CompanyId = "1",
                Counter = "1",
                CPTcode = "1",
                PatientFirstName = "john",
                PatientGroupNumber = "1",
                PatientState = "xyz",
                Plan1 = "1",
                Plan2 = "2",
                ProviderNPI = "2567",
                RequestedBy = "wer"
            };

            _patientLookup.Setup(x => x.GetMemberDetails(It.IsAny<PatientLookupRequestModel>())).Throws(new Exception());

            //Act
            var result = await _controller.GetMemberDetails(request);

            //Assert
            var objectResult = Assert.IsType<ObjectResult>(result);
            Assert.Equal(500,objectResult.StatusCode);

        }
        [Fact]
        public async Task GetMembereligibility_ReturnSuccess()
        {
            //Arrange
            var request = new MemberEligibilityRequestModel()
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

            var response = new List<MemberEligibilityResponseModel>()
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

            _patientLookup.Setup(x => x.GetMemberEligibility(It.IsAny<MemberEligibilityRequestModel>())).ReturnsAsync(response);

            //Act
            var result = await _controller.GetMemberEligibility(request);

            //Assert
            var okObjectResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(200,okObjectResult.StatusCode);

        }

        [Fact]
        public async Task GetMemberEligibility_ReturnBadRequest_WhenPatientIdisEmpty()
        {
            //Arrange
            var request = new MemberEligibilityRequestModel()
            {
                Qualifiers = new MemberEligibility
                {
                    ClientSystem = "ImageOne",
                    DOS = DateTime.Now,
                    InsCarrier = " Cigna",
                    PatientDOB = "25/01/1887",
                    PatientID = " ",
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

            //Act
            var result = await _controller.GetMemberEligibility(request);

            //Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal(400,badRequestResult.StatusCode);
        }

        [Fact]
        public async Task GetMemberEligibility_ReturnBadRequest_WhenPatientDOBisEmpty()
        {
            //Arrange
            var request = new MemberEligibilityRequestModel()
            {
                Qualifiers = new MemberEligibility
                {
                    ClientSystem = "ImageOne",
                    DOS = DateTime.Now,
                    InsCarrier = " Cigna",
                    PatientDOB = "",
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

            //Act
            var result = await _controller.GetMemberEligibility(request);

            //Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal(400,badRequestResult.StatusCode);
        }
        [Fact]
        public async Task GetMembereligibility_ReturnBadRequest_WhenReviewtypeisEmpty()
        {
            //Arrange
            var request = new MemberEligibilityRequestModel()
            {
                Qualifiers = new MemberEligibility
                {
                    ClientSystem = "ImageOne",
                    DOS = DateTime.Now,
                    InsCarrier = " Cigna",
                    PatientDOB = "25/01/1887",
                    PatientID = "A12345678",
                    PatientMemberCode = "1",
                    ReviewType = "",
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

            //Act
            var result = await _controller.GetMemberEligibility(request);

            //Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal(400,badRequestResult.StatusCode);
        }

        [Fact]
        public async Task GetMembereligibility_ReturnBadRequest_WhenqualifiersareNull()
        {
            //Arrange
            var request = new MemberEligibilityRequestModel()
            {
                Qualifiers = null
            };

            //Act
            var result = await _controller.GetMemberEligibility(request);

            //Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal(400,badRequestResult.StatusCode);

        }

        [Fact]
        public async Task GetMembereligibility_InternalServerError_whenThrowsException()
        {
            //Arrange
            var request = new MemberEligibilityRequestModel()
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

            _patientLookup.Setup(x => x.GetMemberEligibility(It.IsAny<MemberEligibilityRequestModel>())).Throws(new Exception());

            //Act
            var result = await _controller.GetMemberEligibility(request);

            //Assert
            Assert.NotNull(result);
        }

        [Fact]
        public async Task GetSiteDetails_ReturnBadRequest()
        {
            //Arrange
            //Act
            var result = await _controller.GetSiteDetails(null);

            //Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal(400,badRequestResult.StatusCode);
        }

        [Fact]
        public async Task GetSiteDetails_ReturnSuccess()
        {
            //Arrange
            var request = new SiteLookupRequest
            {
                LookupType = "REALTIME",
                RequestedBy = "ImageOne",
                CaseSummaryDetail = new CaseSummaryDetail
                {
                    Carrier = "UHC-MEDICARE",
                    PlanCode = "",
                    CompanyId = "3",
                    IsRetroCase = true,
                    Priority = "",
                    ExpLocSite = true,
                    Payor = "UHCMS",
                    CaseProviderTypeID = 0,
                    RetroSite = "",
                    WidgetCPTList = "",
                    CPTCode = "",
                    CPTModality = "",
                    surgeonNPI = ""
                },
                PatientDetail = new Application.Models.SiteRequestModels.PatientDetail
                {
                    JurisdictionState = "",
                    MemberIPACode = "",
                    GroupNumber = "",
                    LineOfBusiness = "",
                    PUSRDF = "",
                    PlanType = "R",
                    PatientId = "",
                    MemberCode = "",
                    DateOfBirth = "",
                    State = "",
                    PatientPlanCode = "CNY",
                    Entity = "",
                    IOQFacilities = "",
                    SOCCase = "",
                    SOCIndicator = "",
                    SSNum = "",
                    TieredNetworkIndicator = ""
                },

                PhysicianDetail = new PhysicianDetail
                {
                    State = "string",
                    OAOPhysicianId = "",
                    ZipCode = "10004",
                    PhysicianDistance = "",
                    PhysicianTin = "",
                    PhysicianLastName = "",
                    PhysicianFirstName = "",
                    PhysicianNPI = ""
                },
                Site = new Application.Models.SiteRequestModels.Site
                {
                    SiteID = "00802A",
                    SiteName = "",
                    SiteCity = "",
                    NonPar = "Y",
                    SiteZip = "",
                    SiteSearchConstraint = "",
                    ContractSite = "Y",
                    SiteState = "",
                    Npi = "1528428521",
                    SiteAddress1 = "205 E 64TH ST",
                    SiteAddress2 = "",
                    AllEntity = "",
                    AllIpaCode = "",
                    CptPrivlegingSiteSearch = "",
                    UspNetworkIds = "",
                    Distance = "",
                    FirstName = "",
                    UnetTciTableNumber = "",
                    UspBenefitServiceArea = "",
                    CallType = "",
                    SiteLifetimeKey = "",
                    NetworkIds = ""
                },
                SiteRule = new SiteRule
                {
                    Steerage = "",
                    IncludeNetworkIds = "",
                    ExcludeNetworkIds = "",
                    MemberIPAs = ""
                }
            };

            var req = new GetSiteDetailsRequestModel()
            {

            };


            SiteSearchResponse response = new SiteSearchResponse()
            {
               Error = new Error
               {
                   Message = "",
                   Type = ""
               },
               Status = "",
               IsSuccess = true,
               SearchResults = new List<SearchResult>
               {
                   new SearchResult
                   {
                        PRVNO = "",
                        PNAME = "",
                        PSNAM = "",
                        APRNO = "",
                        PADD1 = "",
                        PADD2 = "",
                        PCITY = "",
                        PSTAT = "",
                        PAZIP = "",
                        PPHON = "",
                        PFAX = "",
                        PTYPE = "",
                        PTYPEDESC = "",
                        PTYP2 = "",
                        MDPRV = "",
                        PSMID = "",
                        FFS_VENDOR = "",
                        GROUP_CARRIER = "",
                        PLAN_TYPE = "",
                        PROVIDER_ATTRIBUTE = "",
                        PPSTRF = "",
                        PROVIDER_PAR_FLAG = "",
                        SortOrder = 1,
                        GeoZip = 1,
                        SelectableYN = "",
                        NPI = "",
                        TAXID = "",
                        Entity = "",
                        MemberIPACode = "",
                        PUSRDF = "",
                        LastModifiedBy = "",
                        LastModifiedDate = "",
                        NonSiteAlternateID = "",
                        PPPSTS = "",
                        PCPSTRF = "",
                        PCPPLS = "",
                        SiteNetworkStatus = "",
                        AssignmentValue = "",
                        PreferredSort = 1,
                        SiteType = "",
                        SortToken = "",
                        providerTypeValue = "",
                        CONTRACT_EFFECTIVE_DATE = 1,
                        CONTRACT_TERM_DATE = 1
                   }
               }
            };

            _siteLookupManagement.Setup(x => x.GetSiteDetails(It.IsAny<GetSiteDetailsRequestModel>())).ReturnsAsync(response);

            //Act
            var result = await _controller.GetSiteDetails(req);

            //Assert
            var okObjectResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(200,okObjectResult.StatusCode);

        }

        //[Fact]
        //public async Task GetSiteDetails_ReturnBadRequest_2()
        //{
        //    //Arrange
        //    var request = new SiteLookupRequest()
        //    {
        //        LookupType = "REALTIME"
        //    };

        //    _siteLookupManagement.Setup(x => x.GetSiteDetails(It.IsAny<SiteLookupRequest>())).ReturnsAsync(new SiteSearchResponse());

        //    //Act
        //    var result = await _controller.GetSiteDetails(request);

        //    //Assert
        //    var badObjectResult = Assert.IsType<BadRequestObjectResult>(result);
        //    Assert.Equal(400,badObjectResult.StatusCode);

        //}

        [Fact]
        public async Task GetSiteDetails_InternalServerError_whenThrowsException()
        {
            //Arrange
            var request = new GetSiteDetailsRequestModel()
            {
                ProviderOAOID = "",
                ProviderCity = "",
                ProviderEligibilityType = "",
                ProviderName = "",
                ProviderNPI = "",
                ProviderTIN = "",
                ProviderZip = "",
                RequestId = ""
            };


            _siteLookupManagement.Setup(x => x.GetSiteDetails(It.IsAny<GetSiteDetailsRequestModel>())).Throws(new Exception());

            //Act
            var result = await _controller.GetSiteDetails(request);

            //Assert
            Assert.NotNull(result);
        }

        [Fact]
        public async Task UpsertSiteDetails_ReturnBadRequest()
        {
            //Arrange
            var userId = "test-user";
            var claims = new[] { new System.Security.Claims.Claim("sub", userId) };
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("secure_test_key_for_generating_bearer_token_for_testing_123"));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(30),
                signingCredentials: creds
                );
            var jwt = new JwtSecurityTokenHandler().WriteToken(token);

            var context = new DefaultHttpContext();
            context.Request.Headers["Authorization"] = $"Bearer {jwt}";

            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = context
            };
            //Act
            var result = _controller.UpsertSiteDetails(null);

            //Assert
            Assert.NotNull(result.Result);
        }

        [Fact]
        public async Task UpsertSiteDetails_ReturnSuccess()
        {
            //Arrange
            var request = new UpdateSiteDetailsRequestModel()
            {
                CareCoordinationEpisodeId = "",
                OAOSiteID = "",
                NonParSiteID = "",
                OldSiteID = "",
                SiteName = "",
                SiteAddr1 = "",
                SiteAddr2 = "",
                SiteCity = "",
                SiteState = "",
                SiteZip = "",
                SitePhone = "",
                SiteFax = "",
                SiteSpec1 = "",
                SiteSpec2 = "",
                SiteSpecDesc1 = "",
                SiteSpecDesc2 = "",
                SiteAlternateID = "",
                SiteNYMIPar = "",
                SteeragePosition = 1,
                NPI = "",
                SiteIdent = 1,
                SelectionMethodID = 1,
                Email = "",
                PUSRDF = "",
                SiteIPA = "",
                SiteEntity = "",
                SiteType = "",
                UserId = "",
                PhysicianName = ""
            };

            string result = "SUCCESS";

            _siteLookupManagement.Setup(x => x.UpsertSiteDetails(It.IsAny<UpdateSiteDetailsRequestModel>())).Returns(result);

            //Act
            var response = _controller.UpsertSiteDetails(request);

            //Assert
            Assert.NotNull(response.Result);
        }

        [Fact]
        public async Task UpsertSiteDetails_ReturnFailure()
        {
            //Arrange
            var request = new UpdateSiteDetailsRequestModel()
            {
                CareCoordinationEpisodeId = "",
                OAOSiteID = "",
                NonParSiteID = "",
                OldSiteID = "",
                SiteName = "",
                SiteAddr1 = "",
                SiteAddr2 = "",
                SiteCity = "",
                SiteState = "",
                SiteZip = "",
                SitePhone = "",
                SiteFax = "",
                SiteSpec1 = "",
                SiteSpec2 = "",
                SiteSpecDesc1 = "",
                SiteSpecDesc2 = "",
                SiteAlternateID = "",
                SiteNYMIPar = "",
                SteeragePosition = 1,
                NPI = "",
                SiteIdent = 1,
                SelectionMethodID = 1,
                Email = "",
                PUSRDF = "",
                SiteIPA = "",
                SiteEntity = "",
                SiteType = "",
                UserId = "",
                PhysicianName = ""
            };

            string result = "FAILURE";

            _siteLookupManagement.Setup(x => x.UpsertSiteDetails(It.IsAny<UpdateSiteDetailsRequestModel>())).Returns(result);

            //Act
            var response = _controller.UpsertSiteDetails(request);

            //Assert
            Assert.NotNull(response.Result);
        }

        [Fact]
        public async Task UpsertSiteDetails_InternalServerError_whenThrowsException()
        {
            //Arrange
            var request = new UpdateSiteDetailsRequestModel()
            {
            };

            _siteLookupManagement.Setup(x => x.UpsertSiteDetails(It.IsAny<UpdateSiteDetailsRequestModel>())).Throws(new Exception());

            //Act
            var result = _controller.UpsertSiteDetails(request);

            //Assert
            Assert.NotNull(result.Result);
        }
    }
}

