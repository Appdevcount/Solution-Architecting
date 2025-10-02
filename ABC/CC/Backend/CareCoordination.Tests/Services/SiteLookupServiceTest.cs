using AutoMapper;
using CareCoordination.Application.Abstracts.DALInterfaces;
using CareCoordination.Application.Models;
using CareCoordination.Application.Models.SiteRequestModels;
using CareCoordination.DAL.Implementation;
using CareCoordination.Domain.Constants;
using CareCoordination.Domain.Models;
using CareCoordination.Services.Implementation;
using GeneralDataService;
using Microsoft.Extensions.Configuration;
using Moq;
using Moq.Protected;
using Newtonsoft.Json;
using System.Net;
using Xunit;

namespace CareCoordination.Tests.Services
{
    public class SiteLookupServiceTest
    {
        private readonly Mock<ISiteRepository> _siteLookupRepository;
        private readonly SiteLookupService _siteLookupService;
        private readonly Mock<IConfiguration> _mockIConfiguration;
        private readonly Mock<IHttpClientFactory> _mockIHttpClientFactory;
        private readonly Mock<IMapper> _mockMapper;

        public SiteLookupServiceTest()
        {
            _siteLookupRepository = new Mock<ISiteRepository>();
            _mockIConfiguration = new Mock<IConfiguration>();
            _mockIHttpClientFactory = new Mock<IHttpClientFactory>();
            _mockMapper = new Mock<IMapper>();
            _mockIConfiguration.Setup(c => c.GetSection("MemberEligibility:MemberEligibilityUpadsRequestUrl").Value).Returns("https://example.com/");
            _mockIConfiguration.Setup(c => c.GetSection("PhysicianLookup:PhysicianlookupUrl").Value).Returns("https://example.com/");
            _siteLookupService = new SiteLookupService(_mockIConfiguration.Object, _mockIHttpClientFactory.Object, _siteLookupRepository.Object, _mockMapper.Object);
        }

        [Fact]
        public void UpsertSiteDetails_ReturnPatientDetails()
        {
            //Arange
            var request = new UpdateSiteDetailsRequestModel
            {
                CareCoordinationEpisodeId = "A123456789"
            };
            var expectedResponse = "SUCCESS";

            _siteLookupRepository.Setup(s => s.UpsertSiteDetails(It.IsAny<UpdateSiteDetailsRequestModel>())).Returns(expectedResponse);

            //Act
            var result = _siteLookupService.UpsertSiteDetails(request);

            //Assert
            Assert.NotNull(result);
        }

        [Theory]
        [InlineData("789,101", "789", "")]
        [InlineData("789,101", "789", "999")]
        [InlineData("789,101", "", "999")]
        public void ConvertAndSetNetworkTypeForSite_ShouldSetSiteTypeToINN_WhenAllConditionsMet(string siteNetworkIds, string pnrIncludedNetwrokIds, string pnrExcludedNetwrokIds)
        {
            // Arrange
            var sites = new List<GetSitesResponse>
            {
                new GetSitesResponse {
                    PPSTRF = "123",
                    IPACODE = "456",
                    NetworkIds = siteNetworkIds,
                    PROVIDER_PAR_FLAG = "Y",
                    PRVNO = string.Empty,
                    PNAME = string.Empty,
                    PSNAM = string.Empty,
                    APRNO = string.Empty,
                    PADD1 = string.Empty,
                    PADD2 = string.Empty,
                    PCITY = string.Empty,
                    PSTAT = string.Empty,
                    PAZIP = string.Empty,
                    PPHON = string.Empty,
                    PPFAX = string.Empty,
                    PTYPE = string.Empty,
                    PTYP2 = string.Empty,
                    MDPRV = string.Empty,
                    PSMID = string.Empty,
                    CONTRACT_EFFECTIVE_DATE = string.Empty,
                    CONTRACT_TERM_DATE = string.Empty,
                    FFS_VENDOR = string.Empty,
                    GROUP_CARRIER = string.Empty,
                    PLAN_TYPE = string.Empty,
                    PROVIDER_ATTRIBUTE = string.Empty,
                    PreferredSort = string.Empty,
                    GEOZIP = string.Empty,
                    SelectableYN = string.Empty,
                    NPI = string.Empty,
                    TaxID = string.Empty,
                    ENTITY = string.Empty,
                    PUSRDF = string.Empty,
                    PPPSTS = string.Empty
                }
            };

            var mappedSites = new List<SearchResult>
            {
                new SearchResult
                {
                    PPSTRF = "123",
                    MemberIPACode = "456",
                    NetworkIds = siteNetworkIds,
                    PROVIDER_PAR_FLAG = "Y",
                    PRVNO = string.Empty,
                    PNAME = string.Empty,
                    PSNAM = string.Empty,
                    APRNO = string.Empty,
                    PADD1 = string.Empty,
                    PADD2 = string.Empty,
                    PCITY = string.Empty,
                    PSTAT = string.Empty,
                    PAZIP = string.Empty,
                    PPHON = string.Empty,
                    PFAX = string.Empty,
                    PTYPE = string.Empty,
                    PTYPEDESC = string.Empty,
                    PTYP2 = string.Empty,
                    MDPRV = string.Empty,
                    PSMID = string.Empty,
                    CONTRACT_EFFECTIVE_DATE = 0,
                    CONTRACT_TERM_DATE = 0,
                    FFS_VENDOR = string.Empty,
                    GROUP_CARRIER = string.Empty,
                    PLAN_TYPE = string.Empty,
                    PROVIDER_ATTRIBUTE = string.Empty,
                    SortOrder = 0,
                    GeoZip = 10001,
                    SelectableYN = string.Empty,
                    NPI = string.Empty,
                    TAXID = string.Empty,
                    Entity = string.Empty,
                    PUSRDF = string.Empty,
                    LastModifiedBy = string.Empty,
                    LastModifiedDate = string.Empty,
                    NonSiteAlternateID = string.Empty,
                    PPPSTS = string.Empty,
                    PCPSTRF = string.Empty,
                    PCPPLS = string.Empty,
                    SiteNetworkStatus = string.Empty,
                    AssignmentValue = string.Empty,
                    PreferredSort = 1,
                    SiteType = string.Empty,
                    SortToken = string.Empty,
                    providerTypeValue = string.Empty,
                    PhysicianName = string.Empty
                }
            };

            var pnrResponse = new ProviderNetworkRulesResponse
            {
                SiteHCNTRPPPSTRFIncluded = "123",
                SiteIPAIncluded = "456",
                SiteHPSAIPPRVGRNIncluded = pnrIncludedNetwrokIds,
                SiteHPSAIPPRVGRNExcluded = pnrExcludedNetwrokIds,
                LookupType = string.Empty,
                IPAIncluded = string.Empty,
                HCNTRPPPSTRFIncluded = string.Empty,
                HPSAIPPRVGRNExcluded = string.Empty,
                HPSAIPPRVGRNIncluded = string.Empty,
                PhysicianIPAIncluded = string.Empty,
                PhysicianHCNTRPPPSTRFIncluded = string.Empty,
                PhysicianHPSAIPPRVGRNExcluded = string.Empty,
                PhysicianHPSAIPPRVGRNIncluded = string.Empty,

            };

            _mockMapper.Setup(m => m.Map<List<SearchResult>>(sites)).Returns(mappedSites);

            // Act
            var result = _siteLookupService.ConvertAndSetNetworkTypeForSite(sites, pnrResponse);

            // Assert
            Assert.Single(result);
            Assert.Equal(Constants.ProviderNetworkTypeINN, result[0].SiteType);
        }

        [Theory]
        [InlineData("", "", "")]
        [InlineData("789,101", "999", "789")]
        [InlineData("789,101", "", "789")]
        [InlineData("789,101", "999", "")]
        [InlineData("789,101", "102", "789")]
        [InlineData("789,101", "999", "790")]
        [InlineData("789,101", "999", "789", "2")]
        [InlineData("789,101", "", "789", "5", "123")]
        public void ConvertAndSetNetworkTypeForSite_ShouldSetSiteTypeToNonPar_WhenConditionsMet(string siteNetworkIds, string pnrIncludedNetwrokIds, string pnrExcludedNetwrokIds, string siteIPA = "123", string sitePSRTF = "456")
        {
            // Arrange
            var sites = new List<GetSitesResponse> { new GetSitesResponse {
                PPSTRF = "123",
                    IPACODE = "456",
                    NetworkIds = siteNetworkIds,
                    PROVIDER_PAR_FLAG = "Y",
                    PRVNO = string.Empty,
                    PNAME = string.Empty,
                    PSNAM = string.Empty,
                    APRNO = string.Empty,
                    PADD1 = string.Empty,
                    PADD2 = string.Empty,
                    PCITY = string.Empty,
                    PSTAT = string.Empty,
                    PAZIP = string.Empty,
                    PPHON = string.Empty,
                    PPFAX = string.Empty,
                    PTYPE = string.Empty,
                    PTYP2 = string.Empty,
                    MDPRV = string.Empty,
                    PSMID = string.Empty,
                    CONTRACT_EFFECTIVE_DATE = string.Empty,
                    CONTRACT_TERM_DATE = string.Empty,
                    FFS_VENDOR = string.Empty,
                    GROUP_CARRIER = string.Empty,
                    PLAN_TYPE = string.Empty,
                    PROVIDER_ATTRIBUTE = string.Empty,
                    PreferredSort = string.Empty,
                    GEOZIP = string.Empty,
                    SelectableYN = string.Empty,
                    NPI = string.Empty,
                    TaxID = string.Empty,
                    ENTITY = string.Empty,
                    PUSRDF = string.Empty,
                    PPPSTS = string.Empty
            } };
            var mappedSites = new List<SearchResult>
            {
                new SearchResult
                {
                    PPSTRF = "5",
                    MemberIPACode = "999",
                    NetworkIds = siteNetworkIds,
                    PROVIDER_PAR_FLAG = "N",
                    PRVNO = string.Empty,
                    PNAME = string.Empty,
                    PSNAM = string.Empty,
                    APRNO = string.Empty,
                    PADD1 = string.Empty,
                    PADD2 = string.Empty,
                    PCITY = string.Empty,
                    PSTAT = string.Empty,
                    PAZIP = string.Empty,
                    PPHON = string.Empty,
                    PFAX = string.Empty,
                    PTYPE = string.Empty,
                    PTYPEDESC = string.Empty,
                    PTYP2 = string.Empty,
                    MDPRV = string.Empty,
                    PSMID = string.Empty,
                    CONTRACT_EFFECTIVE_DATE = 0,
                    CONTRACT_TERM_DATE = 0,
                    FFS_VENDOR = string.Empty,
                    GROUP_CARRIER = string.Empty,
                    PLAN_TYPE = string.Empty,
                    PROVIDER_ATTRIBUTE = string.Empty,
                    SortOrder = 0,
                    GeoZip = 10001,
                    SelectableYN = string.Empty,
                    NPI = string.Empty,
                    TAXID = string.Empty,
                    Entity = string.Empty,
                    PUSRDF = string.Empty,
                    LastModifiedBy = string.Empty,
                    LastModifiedDate = string.Empty,
                    NonSiteAlternateID = string.Empty,
                    PPPSTS = string.Empty,
                    PCPSTRF = string.Empty,
                    PCPPLS = string.Empty,
                    SiteNetworkStatus = string.Empty,
                    AssignmentValue = string.Empty,
                    PreferredSort = 1,
                    SiteType = string.Empty,
                    SortToken = string.Empty,
                    providerTypeValue = string.Empty,
                    PhysicianName = string.Empty
                }
            };

            var pnrResponse = new ProviderNetworkRulesResponse
            {
                SiteHCNTRPPPSTRFIncluded = siteIPA,
                SiteIPAIncluded = sitePSRTF,
                SiteHPSAIPPRVGRNIncluded = pnrIncludedNetwrokIds,
                SiteHPSAIPPRVGRNExcluded = pnrExcludedNetwrokIds,
                LookupType = string.Empty,
                IPAIncluded = string.Empty,
                HCNTRPPPSTRFIncluded = string.Empty,
                HPSAIPPRVGRNExcluded = string.Empty,
                HPSAIPPRVGRNIncluded = string.Empty,
                PhysicianIPAIncluded = string.Empty,
                PhysicianHCNTRPPPSTRFIncluded = string.Empty,
                PhysicianHPSAIPPRVGRNExcluded = string.Empty,
                PhysicianHPSAIPPRVGRNIncluded = string.Empty,

            };

            _mockMapper.Setup(m => m.Map<List<SearchResult>>(sites)).Returns(mappedSites);

            // Act
            var result = _siteLookupService.ConvertAndSetNetworkTypeForSite(sites, pnrResponse);

            // Assert
            Assert.Equal(Constants.ProviderNetworkTypeNonPar, result[0].SiteType);
        }

        [Fact]
        public void ConvertAndSetNetworkTypeForSite_ShouldSetSiteTypeToOON_WhenNoConditionsMet()
        {
            // Arrange
            var sites = new List<GetSitesResponse> { 
                new GetSitesResponse {
                    PPSTRF = "123",
                    IPACODE = "456",
                    NetworkIds = string.Empty,
                    PROVIDER_PAR_FLAG = "Y",
                    PRVNO = string.Empty,
                    PNAME = string.Empty,
                    PSNAM = string.Empty,
                    APRNO = string.Empty,
                    PADD1 = string.Empty,
                    PADD2 = string.Empty,
                    PCITY = string.Empty,
                    PSTAT = string.Empty,
                    PAZIP = string.Empty,
                    PPHON = string.Empty,
                    PPFAX = string.Empty,
                    PTYPE = string.Empty,
                    PTYP2 = string.Empty,
                    MDPRV = string.Empty,
                    PSMID = string.Empty,
                    CONTRACT_EFFECTIVE_DATE = string.Empty,
                    CONTRACT_TERM_DATE = string.Empty,
                    FFS_VENDOR = string.Empty,
                    GROUP_CARRIER = string.Empty,
                    PLAN_TYPE = string.Empty,
                    PROVIDER_ATTRIBUTE = string.Empty,
                    PreferredSort = string.Empty,
                    GEOZIP = string.Empty,
                    SelectableYN = string.Empty,
                    NPI = string.Empty,
                    TaxID = string.Empty,
                    ENTITY = string.Empty,
                    PUSRDF = string.Empty,
                    PPPSTS = string.Empty
                } };
            var mappedSites = new List<SearchResult>
            {
                new SearchResult
                {
                    PPSTRF = "999",
                    MemberIPACode = "999",
                    NetworkIds = "999",
                    PROVIDER_PAR_FLAG = "Y",
                    PRVNO = string.Empty,
                    PNAME = string.Empty,
                    PSNAM = string.Empty,
                    APRNO = string.Empty,
                    PADD1 = string.Empty,
                    PADD2 = string.Empty,
                    PCITY = string.Empty,
                    PSTAT = string.Empty,
                    PAZIP = string.Empty,
                    PPHON = string.Empty,
                    PFAX = string.Empty,
                    PTYPE = string.Empty,
                    PTYPEDESC = string.Empty,
                    PTYP2 = string.Empty,
                    MDPRV = string.Empty,
                    PSMID = string.Empty,
                    CONTRACT_EFFECTIVE_DATE = 0,
                    CONTRACT_TERM_DATE = 0,
                    FFS_VENDOR = string.Empty,
                    GROUP_CARRIER = string.Empty,
                    PLAN_TYPE = string.Empty,
                    PROVIDER_ATTRIBUTE = string.Empty,
                    SortOrder = 0,
                    GeoZip = 10001,
                    SelectableYN = string.Empty,
                    NPI = string.Empty,
                    TAXID = string.Empty,
                    Entity = string.Empty,
                    PUSRDF = string.Empty,
                    LastModifiedBy = string.Empty,
                    LastModifiedDate = string.Empty,
                    NonSiteAlternateID = string.Empty,
                    PPPSTS = string.Empty,
                    PCPSTRF = string.Empty,
                    PCPPLS = string.Empty,
                    SiteNetworkStatus = string.Empty,
                    AssignmentValue = string.Empty,
                    PreferredSort = 1,
                    SiteType = string.Empty,
                    SortToken = string.Empty,
                    providerTypeValue = string.Empty,
                    PhysicianName = string.Empty
                }
            };

            var pnrResponse = new ProviderNetworkRulesResponse
            {
                SiteHCNTRPPPSTRFIncluded = "123",
                SiteIPAIncluded = "456",
                LookupType = string.Empty,
                IPAIncluded = string.Empty,
                HCNTRPPPSTRFIncluded = string.Empty,
                HPSAIPPRVGRNExcluded = string.Empty,
                HPSAIPPRVGRNIncluded = string.Empty,
                SiteHPSAIPPRVGRNExcluded = string.Empty,
                SiteHPSAIPPRVGRNIncluded = string.Empty,
                PhysicianIPAIncluded = string.Empty,
                PhysicianHCNTRPPPSTRFIncluded = string.Empty,
                PhysicianHPSAIPPRVGRNExcluded = string.Empty,
                PhysicianHPSAIPPRVGRNIncluded = string.Empty,

            };

            _mockMapper.Setup(m => m.Map<List<SearchResult>>(sites)).Returns(mappedSites);

            // Act
            var result = _siteLookupService.ConvertAndSetNetworkTypeForSite(sites, pnrResponse);

            // Assert
            Assert.Equal(Constants.ProviderNetworkTypeOON, result[0].SiteType);
        }

        [Fact]
        public async Task CallPNRPathway_WithEmptyResponse_ThrowsArgumentException()
        {
            //Arrange
            var request = new ProviderNetworkingRulesRequestModel
            {
                ReviewType = Constants.PNRReviewType,
                LookupType = "Both",
                CompanyID = "8",
                GroupNumber = string.Empty,
                MemberIPACode = string.Empty,
                Modality = "029",
                CPTCode = string.Empty,
                InsCarrier = "CIGNA",
                ClientSystem = Constants.WorkFlow,
                Workflow = Constants.WorkFlow
            };

            var responseMessage = new HttpResponseMessage
            {
                StatusCode = HttpStatusCode.OK,
                Content = new StringContent("")
            };

            var httpMessageHandlerMock = new Mock<HttpMessageHandler>();
            httpMessageHandlerMock.Protected()
                .Setup<Task<HttpResponseMessage>>("SendAsync", ItExpr.IsAny<HttpRequestMessage>(), ItExpr.IsAny<CancellationToken>())
                .ReturnsAsync(responseMessage);

            var httpClient = new HttpClient(httpMessageHandlerMock.Object);
            _mockIHttpClientFactory.Setup(_ => _.CreateClient(It.IsAny<string>())).Returns(httpClient);

            //Act & Assert
            await Assert.ThrowsAsync<ArgumentException>(() => _siteLookupService.CallPNRPathway(request));
        }

        [Fact]
        public async Task CallPNRPathway_WithWithResponse_ReturnsResult()
        {
            //Arrange
            var request = new ProviderNetworkingRulesRequestModel
            {
                ReviewType = Constants.PNRReviewType,
                LookupType = "Both",
                CompanyID = "8",
                GroupNumber = string.Empty,
                MemberIPACode = string.Empty,
                Modality = "029",
                CPTCode = string.Empty,
                InsCarrier = "CIGNA",
                ClientSystem = Constants.WorkFlow,
                Workflow = Constants.WorkFlow
            };

            var responseMessage = new HttpResponseMessage
            {
                StatusCode = HttpStatusCode.OK,
                Content = new StringContent("{\"LookupType\":\"Physician\",\"IPA.Included\":\"\",\"HCNTRP.PPSTRF.Included\":\"4\",\"HPSAIP.PRVGRN.Excluded\":\"NW386;NW741\",\"HPSAIP.PRVGRN.Included\":\"\",\"Site.IPA.Included\":\"J2\",\"Site.HCNTRP.PPSTRF.Included\":\"2\",\"Site.HPSAIP.PRVGRN.Excluded\":\"NW386; NW741\",\"Site.HPSAIP.PRVGRN.Included\":\"\",\"Physician.IPA.Included\":\"\",\"Physician.HPSAIP.PRVGRN.Included\":\"\",\"Physician.HCNTRP.PPSTRF.Included\":\"4\",\"Physician.HPSAIP.PRVGRN.Excluded\":\"NW386;NW741\"}")
            };

            var httpMessageHandlerMock = new Mock<HttpMessageHandler>();
            httpMessageHandlerMock.Protected()
                .Setup<Task<HttpResponseMessage>>("SendAsync", ItExpr.IsAny<HttpRequestMessage>(), ItExpr.IsAny<CancellationToken>())
                .ReturnsAsync(responseMessage);

            var httpClient = new HttpClient(httpMessageHandlerMock.Object);
            _mockIHttpClientFactory.Setup(_ => _.CreateClient(It.IsAny<string>())).Returns(httpClient);

            var result = await _siteLookupService.CallPNRPathway(request);

            //Assert
            Assert.NotNull(result);
        }

        [Fact]
        public async Task CallPNRPathway_WhenDeSerializationReturnsNull_ThrowsJsonException()
        {
            //Arrange
            var request = new ProviderNetworkingRulesRequestModel
            {
                ReviewType = Constants.PNRReviewType,
                LookupType = "Both",
                CompanyID = "8",
                GroupNumber = string.Empty,
                MemberIPACode = string.Empty,
                Modality = "029",
                CPTCode = string.Empty,
                InsCarrier = "CIGNA",
                ClientSystem = Constants.WorkFlow,
                Workflow = Constants.WorkFlow
            };

            var responseMessage = new HttpResponseMessage
            {
                StatusCode = HttpStatusCode.OK,
                Content = new StringContent("null")
            };

            var httpMessageHandlerMock = new Mock<HttpMessageHandler>();
            httpMessageHandlerMock.Protected()
                .Setup<Task<HttpResponseMessage>>("SendAsync", ItExpr.IsAny<HttpRequestMessage>(), ItExpr.IsAny<CancellationToken>())
                .ReturnsAsync(responseMessage);

            var httpClient = new HttpClient(httpMessageHandlerMock.Object);
            _mockIHttpClientFactory.Setup(_ => _.CreateClient(It.IsAny<string>())).Returns(httpClient);

            //Assert
            await Assert.ThrowsAsync<JsonException>(() => _siteLookupService.CallPNRPathway(request));
        }

        [Fact]
        public void CreateProvidingNetworkingRuleRequest_WithInput_ReturnsResult()
        {
            var request = new CaseDetailsEntity
            {
                HealthPlan = "CIGNA",
                CompanyId = 8,
                CptCode = string.Empty,
                Modality = "029",
                PatientID = "123",
                PatientDOB = string.Empty,
                PatientName = "Sean",
                PatientState = string.Empty,
                PatientMemberCode = string.Empty,
                MemberQuickCreate = string.Empty,
                PatientIPA = string.Empty,
                GroupNumber = string.Empty,
                PatientZip = "10001",
                PatientEntity = string.Empty,
                PatientPlanType = string.Empty,
                LineOfBusiness = string.Empty,
                PlanType = string.Empty
            };

            var result = _siteLookupService.CreateProvidingNetworkingRuleRequest(request);

            Assert.NotNull(result);
            Assert.Equal(Constants.PNRReviewType, result.ReviewType);
            Assert.Equal("8", result.CompanyID);
        }

        [Fact]
        public async Task GetPhysicianDetails_ReturnsEmptyResult()
        {
            //Arrange
            var PNRresponse = new ProviderNetworkRulesResponse
            {
                SiteHCNTRPPPSTRFIncluded = "123",
                SiteIPAIncluded = "456",
                SiteHPSAIPPRVGRNIncluded = "123",
                SiteHPSAIPPRVGRNExcluded = "456",
                LookupType = string.Empty,
                IPAIncluded = string.Empty,
                HCNTRPPPSTRFIncluded = string.Empty,
                HPSAIPPRVGRNExcluded = string.Empty,
                HPSAIPPRVGRNIncluded = string.Empty,
                PhysicianIPAIncluded = string.Empty,
                PhysicianHCNTRPPPSTRFIncluded = string.Empty,
                PhysicianHPSAIPPRVGRNExcluded = string.Empty,
                PhysicianHPSAIPPRVGRNIncluded = string.Empty,

            };

            var caseDetailsEntity = new CaseDetailsEntity
            {
                HealthPlan = "CIGNA",
                CompanyId = 8,
                CptCode = string.Empty,
                Modality = "029",
                PatientID = "123",
                PatientDOB = string.Empty,
                PatientName = "Sean",
                PatientState = string.Empty,
                PatientMemberCode = string.Empty,
                MemberQuickCreate = string.Empty,
                PatientIPA = string.Empty,
                GroupNumber = string.Empty,
                PatientZip = "10001",
                PatientEntity = string.Empty,
                PatientPlanType = string.Empty,
                LineOfBusiness = string.Empty,
                PlanType = string.Empty
            };

            var siteDetailsRequestModel = new GetSiteDetailsRequestModel
            {
                ProviderCity = "New York",
                ProviderEligibilityType  = "PAR-INN",
                ProviderNPI = string.Empty,
                ProviderName = string.Empty,
                ProviderOAOID = string.Empty,
                ProviderTIN = string.Empty,
                ProviderZip = string.Empty,
                RequestId = string.Empty,
                MemberIPA = string.Empty
            };

            var responseMessage = new HttpResponseMessage
            {
                StatusCode = HttpStatusCode.OK,
                Content = new StringContent("EE4706**BRAHA, STEVEN*29 WEST 34TH ST 4TH FL. *NEW YORK * *NY*10001 *2125632497*2126438201*REFR-NUCMD* *20120701*0*N* *NOTPAYABLE*CIGNA * *CIGPAR *******|J91204**BURNHAM, DANIEL*275 7TH AVE. *NEW YORK * *NY*10001 *2129242510*2128123800*REFR-FAMPR* *20120701*0*N* *NOTPAYABLE*CIGNA * *CIGPAR *******|")
            };

            var httpMessageHandlerMock = new Mock<HttpMessageHandler>();
            httpMessageHandlerMock.Protected()
                .Setup<Task<HttpResponseMessage>>("SendAsync", ItExpr.IsAny<HttpRequestMessage>(), ItExpr.IsAny<CancellationToken>())
                .ReturnsAsync(responseMessage);

            var httpClient = new HttpClient(httpMessageHandlerMock.Object);
            _mockIHttpClientFactory.Setup(_ => _.CreateClient(It.IsAny<string>())).Returns(httpClient);

            var result = await _siteLookupService.GetPhysicianDetails(PNRresponse, caseDetailsEntity, siteDetailsRequestModel);
            //Assert
            Assert.NotNull(result);
            Assert.Equal("EE4706", result[0].PRVNO);
        }

        [Fact]
        public async Task GetPhysicianDetails_ReturnsResult()
        {
            //Arrange
            var PNRresponse = new ProviderNetworkRulesResponse
            {
                SiteHCNTRPPPSTRFIncluded = "123",
                SiteIPAIncluded = "456",
                SiteHPSAIPPRVGRNIncluded = "123",
                SiteHPSAIPPRVGRNExcluded = "456",
                LookupType = string.Empty,
                IPAIncluded = string.Empty,
                HCNTRPPPSTRFIncluded = string.Empty,
                HPSAIPPRVGRNExcluded = string.Empty,
                HPSAIPPRVGRNIncluded = string.Empty,
                PhysicianIPAIncluded = string.Empty,
                PhysicianHCNTRPPPSTRFIncluded = string.Empty,
                PhysicianHPSAIPPRVGRNExcluded = string.Empty,
                PhysicianHPSAIPPRVGRNIncluded = string.Empty,

            };

            var caseDetailsEntity = new CaseDetailsEntity
            {
                HealthPlan = "CIGNA",
                CompanyId = 8,
                CptCode = string.Empty,
                Modality = "029",
                PatientID = "123",
                PatientDOB = string.Empty,
                PatientName = "Sean",
                PatientState = string.Empty,
                PatientMemberCode = string.Empty,
                MemberQuickCreate = string.Empty,
                PatientIPA = string.Empty,
                GroupNumber = string.Empty,
                PatientZip = "10001",
                PatientEntity = string.Empty,
                PatientPlanType = string.Empty,
                LineOfBusiness = string.Empty,
                PlanType = string.Empty
            };

            var siteDetailsRequestModel = new GetSiteDetailsRequestModel
            {
                ProviderCity = "New York",
                ProviderEligibilityType = "PAR-INN",
                ProviderNPI = string.Empty,
                ProviderName = string.Empty,
                ProviderOAOID = string.Empty,
                ProviderTIN = string.Empty,
                ProviderZip = string.Empty,
                RequestId = string.Empty,
                MemberIPA = string.Empty
            };

            var responseMessage = new HttpResponseMessage
            {
                StatusCode = HttpStatusCode.OK,
                Content = new StringContent("")
            };

            var httpMessageHandlerMock = new Mock<HttpMessageHandler>();
            httpMessageHandlerMock.Protected()
                .Setup<Task<HttpResponseMessage>>("SendAsync", ItExpr.IsAny<HttpRequestMessage>(), ItExpr.IsAny<CancellationToken>())
                .ReturnsAsync(responseMessage);

            var httpClient = new HttpClient(httpMessageHandlerMock.Object);
            _mockIHttpClientFactory.Setup(_ => _.CreateClient(It.IsAny<string>())).Returns(httpClient);

            var result = await _siteLookupService.GetPhysicianDetails(PNRresponse, caseDetailsEntity, siteDetailsRequestModel);
            //Assert
            Assert.NotNull(result);
            Assert.Empty(result);
        }

    }
}
