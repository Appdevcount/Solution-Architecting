using AutoMapper;
using CareCoordination.Application.Abstracts.DALInterfaces;
using CareCoordination.Application.Handlers;
using CareCoordination.Application.Models;
using CareCoordination.DAL.Implementation;
using CareCoordination.Domain.Models;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace CareCoordination.Tests.ApplictaionHandlers
{
    public class RequestSearchManagementTest
    {
        private readonly RequestSearchManagement _requestSearchManagement;
        private readonly Mock<IRequestSearch> _requestSearch;

        public RequestSearchManagementTest()
        {
            _requestSearch = new Mock<IRequestSearch>();
            _requestSearchManagement = new RequestSearchManagement(_requestSearch.Object);
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
            List<RequestSearchResult> mockResultEntities = new List<RequestSearchResult>
            {
                new RequestSearchResult
                {
                    CareCoordinationEpisodeId = "123",
                    CareCoordinationEpisodeDate = DateTime.Parse("01/15/2025 00:00:00", System.Globalization.CultureInfo.InvariantCulture),
                    CaseStatus = "Open",
                    HealthPlan = "Cigna",
                    CompanyId = 8,
                    Reason = "Other",
                    DateOfService = DateTime.Parse("01/15/2025 00:00:00", System.Globalization.CultureInfo.InvariantCulture),
                    DateOfClosing = null,
                    IsEscalated = false,
                    StaffedRequest = true,
                    SubServiceType = "testSubServiceType",
                    CreatedBy = "CCUser",
                    CreateDate = DateTime.Parse("01/15/2025 00:00:00", System.Globalization.CultureInfo.InvariantCulture),
                    Program = "Sleep Managment",
                    PatientDetails = new Patient
                    {
                        ID = "U50638807",
                        Name = "PROFITT,HUNTER",
                        DateOfBirth = DateTime.Parse("01/15/2025 00:00:00", System.Globalization.CultureInfo.InvariantCulture),
                    }
                },
            };

            _requestSearch.Setup(d => d.GetRequests(mockRequest)).ReturnsAsync(mockResultEntities);

            // Act
            var result = await _requestSearchManagement.GetRequests(mockRequest);

            // Assert
            Assert.NotNull(result);
            Assert.Single(result);
            Assert.Equal("123", result[0].CareCoordinationEpisodeId);
        }


        [Fact]
        public async Task GetRequestDetailsById_ValidRequest_ReturnsMappedResults()
        {
            // Arrange
            string mockRequestId = "CC123";
            var mockCareCoordinationDetails = new CareCoordinationDetails
            {
                CareCoordinationEpisodeId = mockRequestId,
                CareCoordinationEpisodeDate = DateTime.UtcNow,
                CaseStatus = "Open",
                HealthPlan = "Cigna",
                CompanyId = 8,
                Program = "Sleep",
                Reason = "Other",
                DateOfService = DateTime.UtcNow,
                DateOfClosing = DateTime.UtcNow,
                IsEscalated = false,
                StaffedRequest = true,
                SubServiceType ="testSubServiceType",
                CreatedBy = "CCuser",
                CreateDate = DateTime.UtcNow,
                MissedStartOfCare = false,
                MissedStartOfCareReason = null,
                AssigneeEmailId = null,
                AssigneeName = null,
                AssigneeDate = null,
                PatientDetails = new Application.Models.PatientDetails
                {
                    PatientID = "1234",
                    MemberCode = "01",
                    Name = "john",
                    DateOfBirth = DateTime.UtcNow,
                    GroupNumber = "1253124365",
                    PlanType = "test",
                    LineOfBusiness = "A124251",
                    Language = "eng",
                    PatientPlanType = null,
                    Entity = "T",
                    Category = null,
                    IPA = "ipa",
                    PatientIdent = 123,
                    Email = "",
                    CellPhone = "",
                    JurisdictionState = "NY",
                    TIT19 = null,
                    Calculated_PatientID_PatientMemberCode_GroupNumber = "123401125124365",
                    CaseFactor = 123,
                    PUSRDF = null,
                    FundType = "fund",
                    ERISA = null,
                    EXTID = null,
                    StartDate = DateTime.UtcNow,
                    MemberQuickCreate = false,
                    PatientSex="F",
                    PatientAddr1= "16 INDEP VALE",
                    PatientAddr2 = "",
                    PatientCity = "SATELLITE BEACH",
                    PatientState = "FL",
                    PatientZip="75234",
                },
                Requester = new Application.Models.RequesterInformation
                {
                    Email = "asd",
                    FirstName = "Test",
                    LastName = "Test",
                    ContactExtension = "Test",
                    Facility = "Test",
                    ContactNumber = "12345",
                    FaxNumber = "123456",
                },
                CaseManager = new CaseManager
                {
                    FirstName = "Test",
                    LastName = "Test",
                    Email = "Test@email.com",
                    Extention = "12213434",
                    PhoneNumber = "12345"
                },
                Site = new Site
                {
                    OAOSiteID = null,
                    NonParSiteID = null,
                    OldSiteID = null,
                    Name = null,
                    Addr1 = null,
                    Addr2 = null,
                    City = null,
                    State = null,
                    Zip = null,
                    Phone = null,
                    Fax = null,
                    Spec1 = null,
                    Spec2 = null,
                    SpecDescription1 = null,
                    SpecDescription2 = null,
                    AlternateID = null,
                    NYMIPar = null,
                    SteeragePosition = null,
                    NPI = null,
                    SiteIdent = null,
                    SelectionMethodID = null,
                    Email = null,
                    PUSRDF = null,
                    IPA = null,
                    Entity = null,
                    SiteType = null,
                },
                FollowUp = new FollowUpDetails
                {
                    FollowUpDate = DateTime.Now,
                    Notes = ""
                },
                Notes = new List<Note>
                {
                    new Note
                    {
                        Id = 1,
                        Notes = "test",
                        CreatedBy = "CCUser",
                        CreatedDate = DateTime.Now
                    }
                },
                Attachments = new List<Attachment>
                {
                    new Attachment
                    {
                        Id = 1,
                        AttachmentName = "test",
                        CreatedBy = "CCUser",
                        AMSObjectValetId = "17a4bb35-3268-4181-988f-abef6e",
                        DocumentType ="AOR",
                        CreatedDate = DateTime.Now,
                        ReceivedDate = DateTime.Now
                    }
                },
                CPTCodes = new List<CptCodeModel>
                {
                    new CptCodeModel
                    {
                        Id = 1,
                        CptCode = "test",
                        CreatedBy = "CCUser",
                        CreatedDate = DateTime.Now,
                        SimplifiedDescription = "test",
                        PrivateDutyNurse = true,
                        CustomNeed = true
                    }
                },
                Activity = new List<CareCoordinationActivity>
                {
                    new CareCoordinationActivity
                    {
                        Id = 1,
                        UserId = "CCUser",
                        Comments = "Test",
                        CreatedBy = "CCUser",
                        CreatedDate = DateTime.Now,
                        RoleType = "test"
                    }
                }
            };

            _requestSearch.Setup(d => d.GetRequestDetailsById(mockRequestId)).ReturnsAsync(mockCareCoordinationDetails);
            // Act
            var result = await _requestSearchManagement.GetRequestDetailsById(mockRequestId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("CC123", result.CareCoordinationEpisodeId);
        }
    }
}
