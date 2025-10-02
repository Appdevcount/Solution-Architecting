using Xunit;
using Moq;
using AutoMapper;
using Microsoft.Extensions.Configuration;
using Microsoft.Data.SqlClient;
using Dapper;
using System.Data;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using CareCoordination.Application.Models;
using CareCoordination.DAL.Implementation;
using CareCoordination.Domain.Models;
using System.ComponentModel.Design;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.VisualStudio.TestPlatform.TestHost;
using Moq.Dapper;
using CareCoordination.DAL.Mappers;
using static System.Net.Mime.MediaTypeNames;
using System.Diagnostics.Metrics;
using CareCoordination.Application.Abstracts.DALInterfaces;
using static Dapper.SqlMapper;
using Azure.Core;

namespace CareCoordination.Tests.DalServices
{
    public class RequestSearchTests
    {
        private readonly IMapper _mockMapper;
        private readonly RequestSearch _requestSearch;
        private readonly Mock<IDbService> _mockDbService;

        public RequestSearchTests()
        {
            var config = new MapperConfiguration(cfg =>
            {
                cfg.AddMaps(typeof(DalMappingProfile).Assembly);
            });
            _mockMapper = config.CreateMapper();
            _mockDbService = new Mock<IDbService>();
            _requestSearch = new RequestSearch(_mockMapper, _mockDbService.Object);
        }

        [Fact]
        public async Task GetRequests_ValidRequest_ReturnsMappedResults()
        {
            // Arrange
            var mockRequest = new GetCareCoordinationRequestModel
            {
                Id = "123",
                FirstName = "",
                LastName = "",
                DateOfBirth = "",
                Status = "All",
                UserName = "testuser"
            };
            var mockResultEntities = new List<RequestSearchResultEntity>
            {
                new RequestSearchResultEntity
                {
                    CareCoordinationEpisodeId = "123",
                    CareCoordinationEpisodeDate = "01/15/2025 00:00:00",
                    CaseStatus = "Open",
                    HealthPlan = "Cigna",
                    CompanyId = 8,
                    Reason = "Other",
                    DateOfService = "01/15/2025 00:00:00",
                    DateOfClosing = null,
                    IsEscalated = false,
                    StaffedRequest =true,
                    SubServiceType = "TestSubServiceType",
                    CreatedBy = "aditya.mahakal",
                    CreateDate = "01/15/2025 00:00:00",
                    PatientID = "U50638807",
                    PatientName = "PROFITT,HUNTER",
                    PatientDOB = "11/19/1969 00:00:00",
                    Program = "Sleep Managment"
                },
            };

            _mockDbService.Setup(d => d.QueryAsync<RequestSearchResultEntity>("usp_GetCCrequests", It.IsAny<object>(), CommandType.StoredProcedure, null, null)).ReturnsAsync(mockResultEntities);

            // Act
            var result = await _requestSearch.GetRequests(mockRequest);

            // Assert
            Assert.NotNull(result);
            Assert.Single(result);
            Assert.Equal("123", result[0].CareCoordinationEpisodeId);
        }

        [Fact]
        public async Task GetRequests_NullParameters_ReturnsEmptyList()
        {
            // Arrange
            var mockRequest = new GetCareCoordinationRequestModel();
            var mockResultEntities = new List<RequestSearchResultEntity>();

            _mockDbService
                .Setup(c => c.QueryAsync<RequestSearchResultEntity>("usp_GetCCrequests", It.IsAny<object>(), CommandType.StoredProcedure, null, null))
                .ReturnsAsync(mockResultEntities);

            // Act
            var result = await _requestSearch.GetRequests(mockRequest);

            // Assert
            Assert.Empty(result);
        }

        [Fact]
        public async Task GetRequestDetailsById_ValidRequest_ReturnsMappedResults()
        {
            // Arrange
            string mockRequestId = "CC123";
            var mockCarecoordinationEntity = new CareCoordinationRequestEntity
            {
                CareCoordinationEpisodeId = mockRequestId,
                CareCoordinationEpisodeDate = "01/15/2025 00:00:00",
                CaseStatus = "Open",
                RequesterFName = "Test",
                RequesterLName = "Test",
                RequesterContactNo = "12341516171",
                RequesterContactExt = null,
                RequesterFaxNo = "12341516171",
                RequesterFacility = null,
                RequesterEmailID = "test@evicore.com",
                HealthPlan = "CIGNA",
                CompanyId = 8,
                Reason = "Other",
                DateOfService = "01/15/2025 00:00:00",
                DateOfClosing = null,
                IsEscalated = false,
                FollowUpDate = "01/15/2025 00:00:00",
                FollowUpNotes = "Test",
                CaseManagerFName = null,
                CaseManagerLName = null,
                CaseManagerPhoneNo = null,
                CaseManagerExtention = null,
                CaseManagerEmail = "test@evicore.com",
                MissedStartOfCare = false,
                MissedStartOfCareReason = null,
                AssigneeEmailId = "aditya.mahakal@evicore.com",
                AssigneeName = "aditya.mahakal",
                AssigneeDate = "01/15/2025 00:00:00",
                CreatedBy = "Aditya.Mahakal",
                CreateDate = "01/15/2025 00:00:00",
                PatientID = "U50638807",
                PatientMemberCode = "1",
                PatientName = "PROFITT,HUNTER",
                PatientDOB = "",
                GroupNumber = "3337286",
                PlanType = "C66",
                LineOfBusiness = "FL1NNNG520N",
                Language = "",
                PatientPlanType = "P",
                PatientEntity = "CXX",
                Category = "",
                PatientIPA = "CK",
                PatientIdent = 116615831,
                Email = "",
                CellPhone = "",
                JurisdictionState = "FL",
                TIT19 = "N358",
                Calculated_PatientID_PatientMemberCode_GroupNumber = "U50638807013337286",
                CaseFactor = 0,
                PatientPUSRDF = "",
                FundType = "",
                ERISA = "",
                EXTID = "",
                MemberStartDate = "01/15/2025 00:00:00",
                MemberQuickCreate = false,
                PatientSex = "F",
                PatientAddr1 = "16 INDEP VALE",
                PatientAddr2 = "",
                PatientCity = "SATELLITE BEACH",
                PatientState = "FL",
                PatientZip = "75234",
                OAOSiteID = null,
                NonParSiteID = null,
                OldSiteID = null,
                SiteName = null,
                SiteAddr1 = null,
                SiteAddr2 = null,
                SiteCity = null,
                SiteState = null,
                SiteZip = null,
                SitePhone = null,
                SiteFax = null,
                SiteSpec1 = null,
                SiteSpec2 = null,
                SiteSpecDesc1 = null,
                SiteSpecDesc2 = null,
                SiteAlternateID = null,
                SiteNYMIPar = null,
                SteeragePosition = null,
                NPI = null,
                SiteIdent = null,
                SelectionMethodID = null,
                SiteEmail = null,
                PUSRDF = null,
                SiteIPA = null,
                SiteEntity = null,
                SiteType = null,
                Program = "Sleep Management",
                PhysicianName = null,
                OON = "N"
            };
            var mockAttachmentsentity = new List<AttachmentEntity>
            {
                new AttachmentEntity
                {
                    Id = 1,
                    ReceivedDate = null,
                    AttachmentName = "File1",
                    AMSObjectValetId = "17a4bb35-3268-4181-988f-abef6e",
                    DocumentType ="AOR",
                    CreatedBy = "CCUser",
                    CreatedDate = null
                }
            };
            var mockNoteEntity = new List<NoteEntity>
            {
                new NoteEntity
                {
                    Id = 1,
                    Notes = "Test Note",
                    CreatedBy = "CCUser",
                    CreatedDate = "01/15/2025 00:00:00"
                }
            };
            var mockCptCodeEntity = new List<CptCodeEntity>
            {
                new CptCodeEntity
                {
                    Id = 1,
                    CptCode = "",
                    CPTSimplifiedDesc = "",
                    CreatedBy = "CCUser",
                    CreatedDate = "01/15/2025 00:00:00",
                    PrivateDutyNurse = true,
                    CustomNeed = false
                }
            };
            var mockCareCoordinationActivityEntity = new List<CareCoordinationActivityEntity>
            {
                new CareCoordinationActivityEntity
                {
                    Id= 1,
                    Comments="CCUser Created the Request.",
                    UserId="CCUser",
                    RoleType="CCUser",
                    CreatedBy = "CCUser",
                    CreatedDate = "01/15/2025 00:00:00"
                }
            };
            GetRequestDetailsByIdResultModel? mockGetRequestDetailsByIdResultModel = new GetRequestDetailsByIdResultModel
            {
                RequestEntity = mockCarecoordinationEntity,
                AttachmentsEntity = mockAttachmentsentity,
                NotesEntity = mockNoteEntity,
                CptCodesEntity = mockCptCodeEntity,
                ActivitiesEntity = mockCareCoordinationActivityEntity
            };
            
            _mockDbService.Setup(d => d.QueryMultipleAsyncForRequestDetails("usp_GetCCrequestById", It.IsAny<object>(), CommandType.StoredProcedure, null, null))
                .ReturnsAsync(mockGetRequestDetailsByIdResultModel);
            // Act
            var result = await _requestSearch.GetRequestDetailsById(mockRequestId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("CC123", result.CareCoordinationEpisodeId);
            Assert.Equal(mockAttachmentsentity.Count, result?.Attachments?.Count);
            Assert.Equal(mockNoteEntity.Count, result?.Notes?.Count);
            Assert.Equal(mockCptCodeEntity.Count, result?.CPTCodes?.Count);
            Assert.Equal(mockCareCoordinationActivityEntity.Count, result?.Activity?.Count);
        }

        [Fact]
        public async Task GetRequestDetailsById_ValidRequest_ReturnsEmptyResults()
        {
            // Arrange
            var mockRequestId = "CC1";
            GetRequestDetailsByIdResultModel? mockGetRequestDetailsByIdResultModel = null;

            _mockDbService.Setup(d => d.QueryMultipleAsyncForRequestDetails("usp_GetCCrequestById", It.IsAny<object>(), CommandType.StoredProcedure, null, null))
                .ReturnsAsync(mockGetRequestDetailsByIdResultModel);
            // Act
            var result = await _requestSearch.GetRequestDetailsById(mockRequestId);

            // Assert
            Assert.Null(result.CareCoordinationEpisodeId);
        }


        [Fact]
        public async Task GetRequestDetailsById_ValidRequest_WhenPrivateDutyNurseIsNull_AndCustomNeedIsNull()
        {
            // Arrange
            string mockRequestId = "CC123";
            var mockCarecoordinationEntity = new CareCoordinationRequestEntity
            {
                CareCoordinationEpisodeId = mockRequestId,
                CareCoordinationEpisodeDate = "01/15/2025 00:00:00",
                CaseStatus = "Open",
                RequesterFName = "Test",
                RequesterLName = "Test",
                RequesterContactNo = "12341516171",
                RequesterContactExt = null,
                RequesterFaxNo = "12341516171",
                RequesterFacility = null,
                RequesterEmailID = "test@evicore.com",
                HealthPlan = "CIGNA",
                CompanyId = 8,
                Reason = "Other",
                DateOfService = "01/15/2025 00:00:00",
                DateOfClosing = null,
                IsEscalated = false,
                FollowUpDate = "01/15/2025 00:00:00",
                FollowUpNotes = "Test",
                CaseManagerFName = null,
                CaseManagerLName = null,
                CaseManagerPhoneNo = null,
                CaseManagerExtention = null,
                CaseManagerEmail = "test@evicore.com",
                MissedStartOfCare = false,
                MissedStartOfCareReason = null,
                AssigneeEmailId = "aditya.mahakal@evicore.com",
                AssigneeName = "aditya.mahakal",
                AssigneeDate = "01/15/2025 00:00:00",
                CreatedBy = "Aditya.Mahakal",
                CreateDate = "01/15/2025 00:00:00",
                PatientID = "U50638807",
                PatientMemberCode = "1",
                PatientName = "PROFITT,HUNTER",
                PatientDOB = "",
                GroupNumber = "3337286",
                PlanType = "C66",
                LineOfBusiness = "FL1NNNG520N",
                Language = "",
                PatientPlanType = "P",
                PatientEntity = "CXX",
                Category = "",
                PatientIPA = "CK",
                PatientIdent = 116615831,
                Email = "",
                CellPhone = "",
                JurisdictionState = "FL",
                TIT19 = "N358",
                Calculated_PatientID_PatientMemberCode_GroupNumber = "U50638807013337286",
                CaseFactor = 0,
                PatientPUSRDF = "",
                FundType = "",
                ERISA = "",
                EXTID = "",
                MemberStartDate = "01/15/2025 00:00:00",
                MemberQuickCreate = false,
                PatientSex = "F",
                PatientAddr1 = "16 INDEP VALE",
                PatientAddr2 = "",
                PatientCity = "SATELLITE BEACH",
                PatientState = "FL",
                PatientZip = "75234",
                OAOSiteID = null,
                NonParSiteID = null,
                OldSiteID = null,
                SiteName = null,
                SiteAddr1 = null,
                SiteAddr2 = null,
                SiteCity = null,
                SiteState = null,
                SiteZip = null,
                SitePhone = null,
                SiteFax = null,
                SiteSpec1 = null,
                SiteSpec2 = null,
                SiteSpecDesc1 = null,
                SiteSpecDesc2 = null,
                SiteAlternateID = null,
                SiteNYMIPar = null,
                SteeragePosition = null,
                NPI = null,
                SiteIdent = null,
                SelectionMethodID = null,
                SiteEmail = null,
                PUSRDF = null,
                SiteIPA = null,
                SiteEntity = null,
                SiteType = null,
                Program = "Sleep Management",
                PhysicianName = null,
                OON = "N"
            };
            var mockAttachmentsentity = new List<AttachmentEntity>
            {
                new AttachmentEntity
                {
                    Id = 1,
                    ReceivedDate = null,
                    AttachmentName = "File1",
                    AMSObjectValetId = "17a4bb35-3268-4181-988f-abef6e",
                    DocumentType ="AOR",
                    CreatedBy = "CCUser",
                    CreatedDate = null
                }
            };
            var mockNoteEntity = new List<NoteEntity>
            {
                new NoteEntity
                {
                    Id = 1,
                    Notes = "Test Note",
                    CreatedBy = "CCUser",
                    CreatedDate = "01/15/2025 00:00:00"
                }
            };
            var mockCptCodeEntity = new List<CptCodeEntity>
            {
                new CptCodeEntity
                {
                    Id = 1,
                    CptCode = "",
                    CPTSimplifiedDesc = "",
                    CreatedBy = "CCUser",
                    CreatedDate = "01/15/2025 00:00:00",
                    PrivateDutyNurse = null,
                    CustomNeed = null
                }
            };
            var mockCareCoordinationActivityEntity = new List<CareCoordinationActivityEntity>
            {
                new CareCoordinationActivityEntity
                {
                    Id= 1,
                    Comments="CCUser Created the Request.",
                    UserId="CCUser",
                    RoleType="CCUser",
                    CreatedBy = "CCUser",
                    CreatedDate = "01/15/2025 00:00:00"
                }
            };
            GetRequestDetailsByIdResultModel? mockGetRequestDetailsByIdResultModel = new GetRequestDetailsByIdResultModel
            {
                RequestEntity = mockCarecoordinationEntity,
                AttachmentsEntity = mockAttachmentsentity,
                NotesEntity = mockNoteEntity,
                CptCodesEntity = mockCptCodeEntity,
                ActivitiesEntity = mockCareCoordinationActivityEntity
            };

            _mockDbService.Setup(d => d.QueryMultipleAsyncForRequestDetails("usp_GetCCrequestById", It.IsAny<object>(), CommandType.StoredProcedure, null, null))
                .ReturnsAsync(mockGetRequestDetailsByIdResultModel);
            // Act
            var result = await _requestSearch.GetRequestDetailsById(mockRequestId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("CC123", result.CareCoordinationEpisodeId);
            Assert.Equal(mockAttachmentsentity.Count, result?.Attachments?.Count);
            Assert.Equal(mockNoteEntity.Count, result?.Notes?.Count);
            Assert.Equal(mockCptCodeEntity.Count, result?.CPTCodes?.Count);
            Assert.Equal(mockCareCoordinationActivityEntity.Count, result?.Activity?.Count);
        }

        [Fact]
        public async Task GetRequestDetailsById_ValidRequest_WhenPrivateDutyNurseIsNull_AndCustomNeedIsTrue()
        {
            // Arrange
            string mockRequestId = "CC123";
            var mockCarecoordinationEntity = new CareCoordinationRequestEntity
            {
                CareCoordinationEpisodeId = mockRequestId,
                CareCoordinationEpisodeDate = "01/15/2025 00:00:00",
                CaseStatus = "Open",
                RequesterFName = "Test",
                RequesterLName = "Test",
                RequesterContactNo = "12341516171",
                RequesterContactExt = null,
                RequesterFaxNo = "12341516171",
                RequesterFacility = null,
                RequesterEmailID = "test@evicore.com",
                HealthPlan = "CIGNA",
                CompanyId = 8,
                Reason = "Other",
                DateOfService = "01/15/2025 00:00:00",
                DateOfClosing = null,
                IsEscalated = false,
                FollowUpDate = "01/15/2025 00:00:00",
                FollowUpNotes = "Test",
                CaseManagerFName = null,
                CaseManagerLName = null,
                CaseManagerPhoneNo = null,
                CaseManagerExtention = null,
                CaseManagerEmail = "test@evicore.com",
                MissedStartOfCare = false,
                MissedStartOfCareReason = null,
                AssigneeEmailId = "aditya.mahakal@evicore.com",
                AssigneeName = "aditya.mahakal",
                AssigneeDate = "01/15/2025 00:00:00",
                CreatedBy = "Aditya.Mahakal",
                CreateDate = "01/15/2025 00:00:00",
                PatientID = "U50638807",
                PatientMemberCode = "1",
                PatientName = "PROFITT,HUNTER",
                PatientDOB = "",
                GroupNumber = "3337286",
                PlanType = "C66",
                LineOfBusiness = "FL1NNNG520N",
                Language = "",
                PatientPlanType = "P",
                PatientEntity = "CXX",
                Category = "",
                PatientIPA = "CK",
                PatientIdent = 116615831,
                Email = "",
                CellPhone = "",
                JurisdictionState = "FL",
                TIT19 = "N358",
                Calculated_PatientID_PatientMemberCode_GroupNumber = "U50638807013337286",
                CaseFactor = 0,
                PatientPUSRDF = "",
                FundType = "",
                ERISA = "",
                EXTID = "",
                MemberStartDate = "01/15/2025 00:00:00",
                MemberQuickCreate = false,
                PatientSex = "F",
                PatientAddr1 = "16 INDEP VALE",
                PatientAddr2 = "",
                PatientCity = "SATELLITE BEACH",
                PatientState = "FL",
                PatientZip = "75234",
                OAOSiteID = null,
                NonParSiteID = null,
                OldSiteID = null,
                SiteName = null,
                SiteAddr1 = null,
                SiteAddr2 = null,
                SiteCity = null,
                SiteState = null,
                SiteZip = null,
                SitePhone = null,
                SiteFax = null,
                SiteSpec1 = null,
                SiteSpec2 = null,
                SiteSpecDesc1 = null,
                SiteSpecDesc2 = null,
                SiteAlternateID = null,
                SiteNYMIPar = null,
                SteeragePosition = null,
                NPI = null,
                SiteIdent = null,
                SelectionMethodID = null,
                SiteEmail = null,
                PUSRDF = null,
                SiteIPA = null,
                SiteEntity = null,
                SiteType = null,
                Program = "Sleep Management",
                PhysicianName = null,
                OON = "N"
            };
            var mockAttachmentsentity = new List<AttachmentEntity>
            {
                new AttachmentEntity
                {
                    Id = 1,
                    ReceivedDate = null,
                    AttachmentName = "File1",
                    AMSObjectValetId = "17a4bb35-3268-4181-988f-abef6e",
                    DocumentType ="AOR",
                    CreatedBy = "CCUser",
                    CreatedDate = null
                }
            };
            var mockNoteEntity = new List<NoteEntity>
            {
                new NoteEntity
                {
                    Id = 1,
                    Notes = "Test Note",
                    CreatedBy = "CCUser",
                    CreatedDate = "01/15/2025 00:00:00"
                }
            };
            var mockCptCodeEntity = new List<CptCodeEntity>
            {
                new CptCodeEntity
                {
                    Id = 1,
                    CptCode = "",
                    CPTSimplifiedDesc = "",
                    CreatedBy = "CCUser",
                    CreatedDate = "01/15/2025 00:00:00",
                    PrivateDutyNurse = null,
                    CustomNeed = true
                }
            };
            var mockCareCoordinationActivityEntity = new List<CareCoordinationActivityEntity>
            {
                new CareCoordinationActivityEntity
                {
                    Id= 1,
                    Comments="CCUser Created the Request.",
                    UserId="CCUser",
                    RoleType="CCUser",
                    CreatedBy = "CCUser",
                    CreatedDate = "01/15/2025 00:00:00"
                }
            };
            GetRequestDetailsByIdResultModel? mockGetRequestDetailsByIdResultModel = new GetRequestDetailsByIdResultModel
            {
                RequestEntity = mockCarecoordinationEntity,
                AttachmentsEntity = mockAttachmentsentity,
                NotesEntity = mockNoteEntity,
                CptCodesEntity = mockCptCodeEntity,
                ActivitiesEntity = mockCareCoordinationActivityEntity
            };

            _mockDbService.Setup(d => d.QueryMultipleAsyncForRequestDetails("usp_GetCCrequestById", It.IsAny<object>(), CommandType.StoredProcedure, null, null))
                .ReturnsAsync(mockGetRequestDetailsByIdResultModel);
            // Act
            var result = await _requestSearch.GetRequestDetailsById(mockRequestId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("CC123", result.CareCoordinationEpisodeId);
            Assert.Equal(mockAttachmentsentity.Count, result?.Attachments?.Count);
            Assert.Equal(mockNoteEntity.Count, result?.Notes?.Count);
            Assert.Equal(mockCptCodeEntity.Count, result?.CPTCodes?.Count);
            Assert.Equal(mockCareCoordinationActivityEntity.Count, result?.Activity?.Count);
        }


        [Fact]
        public async Task GetRequestDetailsById_ValidRequest_WhenPrivateDutyNurseIsTrue_AndCustomNeedIsNull()
        {
            // Arrange
            string mockRequestId = "CC123";
            var mockCarecoordinationEntity = new CareCoordinationRequestEntity
            {
                CareCoordinationEpisodeId = mockRequestId,
                CareCoordinationEpisodeDate = "01/15/2025 00:00:00",
                CaseStatus = "Open",
                RequesterFName = "Test",
                RequesterLName = "Test",
                RequesterContactNo = "12341516171",
                RequesterContactExt = null,
                RequesterFaxNo = "12341516171",
                RequesterFacility = null,
                RequesterEmailID = "test@evicore.com",
                HealthPlan = "CIGNA",
                CompanyId = 8,
                Reason = "Other",
                DateOfService = "01/15/2025 00:00:00",
                DateOfClosing = null,
                IsEscalated = false,
                FollowUpDate = "01/15/2025 00:00:00",
                FollowUpNotes = "Test",
                CaseManagerFName = null,
                CaseManagerLName = null,
                CaseManagerPhoneNo = null,
                CaseManagerExtention = null,
                CaseManagerEmail = "test@evicore.com",
                MissedStartOfCare = false,
                MissedStartOfCareReason = null,
                AssigneeEmailId = "aditya.mahakal@evicore.com",
                AssigneeName = "aditya.mahakal",
                AssigneeDate = "01/15/2025 00:00:00",
                CreatedBy = "Aditya.Mahakal",
                CreateDate = "01/15/2025 00:00:00",
                PatientID = "U50638807",
                PatientMemberCode = "1",
                PatientName = "PROFITT,HUNTER",
                PatientDOB = "",
                GroupNumber = "3337286",
                PlanType = "C66",
                LineOfBusiness = "FL1NNNG520N",
                Language = "",
                PatientPlanType = "P",
                PatientEntity = "CXX",
                Category = "",
                PatientIPA = "CK",
                PatientIdent = 116615831,
                Email = "",
                CellPhone = "",
                JurisdictionState = "FL",
                TIT19 = "N358",
                Calculated_PatientID_PatientMemberCode_GroupNumber = "U50638807013337286",
                CaseFactor = 0,
                PatientPUSRDF = "",
                FundType = "",
                ERISA = "",
                EXTID = "",
                MemberStartDate = "01/15/2025 00:00:00",
                MemberQuickCreate = false,
                PatientSex = "F",
                PatientAddr1 = "16 INDEP VALE",
                PatientAddr2 = "",
                PatientCity = "SATELLITE BEACH",
                PatientState = "FL",
                PatientZip = "75234",
                OAOSiteID = null,
                NonParSiteID = null,
                OldSiteID = null,
                SiteName = null,
                SiteAddr1 = null,
                SiteAddr2 = null,
                SiteCity = null,
                SiteState = null,
                SiteZip = null,
                SitePhone = null,
                SiteFax = null,
                SiteSpec1 = null,
                SiteSpec2 = null,
                SiteSpecDesc1 = null,
                SiteSpecDesc2 = null,
                SiteAlternateID = null,
                SiteNYMIPar = null,
                SteeragePosition = null,
                NPI = null,
                SiteIdent = null,
                SelectionMethodID = null,
                SiteEmail = null,
                PUSRDF = null,
                SiteIPA = null,
                SiteEntity = null,
                SiteType = null,
                Program = "Sleep Management",
                PhysicianName = null,
                OON = "N"
            };
            var mockAttachmentsentity = new List<AttachmentEntity>
            {
                new AttachmentEntity
                {
                    Id = 1,
                    ReceivedDate = null,
                    AttachmentName = "File1",
                    AMSObjectValetId = "17a4bb35-3268-4181-988f-abef6e",
                    DocumentType ="AOR",
                    CreatedBy = "CCUser",
                    CreatedDate = null
                }
            };
            var mockNoteEntity = new List<NoteEntity>
            {
                new NoteEntity
                {
                    Id = 1,
                    Notes = "Test Note",
                    CreatedBy = "CCUser",
                    CreatedDate = "01/15/2025 00:00:00"
                }
            };
            var mockCptCodeEntity = new List<CptCodeEntity>
            {
                new CptCodeEntity
                {
                    Id = 1,
                    CptCode = "",
                    CPTSimplifiedDesc = "",
                    CreatedBy = "CCUser",
                    CreatedDate = "01/15/2025 00:00:00",
                    PrivateDutyNurse = true,
                    CustomNeed = null
                }
            };
            var mockCareCoordinationActivityEntity = new List<CareCoordinationActivityEntity>
            {
                new CareCoordinationActivityEntity
                {
                    Id= 1,
                    Comments="CCUser Created the Request.",
                    UserId="CCUser",
                    RoleType="CCUser",
                    CreatedBy = "CCUser",
                    CreatedDate = "01/15/2025 00:00:00"
                }
            };
            GetRequestDetailsByIdResultModel? mockGetRequestDetailsByIdResultModel = new GetRequestDetailsByIdResultModel
            {
                RequestEntity = mockCarecoordinationEntity,
                AttachmentsEntity = mockAttachmentsentity,
                NotesEntity = mockNoteEntity,
                CptCodesEntity = mockCptCodeEntity,
                ActivitiesEntity = mockCareCoordinationActivityEntity
            };

            _mockDbService.Setup(d => d.QueryMultipleAsyncForRequestDetails("usp_GetCCrequestById", It.IsAny<object>(), CommandType.StoredProcedure, null, null))
                .ReturnsAsync(mockGetRequestDetailsByIdResultModel);
            // Act
            var result = await _requestSearch.GetRequestDetailsById(mockRequestId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("CC123", result.CareCoordinationEpisodeId);
            Assert.Equal(mockAttachmentsentity.Count, result?.Attachments?.Count);
            Assert.Equal(mockNoteEntity.Count, result?.Notes?.Count);
            Assert.Equal(mockCptCodeEntity.Count, result?.CPTCodes?.Count);
            Assert.Equal(mockCareCoordinationActivityEntity.Count, result?.Activity?.Count);
        }
    }
}