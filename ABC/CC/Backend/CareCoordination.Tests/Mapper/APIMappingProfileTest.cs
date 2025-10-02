using AutoMapper;
using CareCoordination.Api.DTOs;
using CareCoordination.Api.Mapper;
using CareCoordination.Application.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace CareCoordination.Tests.Mapper
{
    public class APIMappingProfileTest
    {
        private readonly IMapper _mapper;
        private readonly MapperConfiguration _configuration;

        public APIMappingProfileTest() 
        {
            _configuration = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile<ApiMappingProfile>();
            });
            _mapper = _configuration.CreateMapper();
        }

        [Fact]
        public void AutoMapper_configuration_IsValid()
        {
            _configuration.AssertConfigurationIsValid();
        }

        [Fact]
        public void Should_Map_CareCoordinationRequest_To_CareCoordinationRequestModel()
        {
            //Arange
            var request = new CareCoordinationRequest
            {
                EpisodeId = "123",
                CompanyId = 1,
                HealthPlan = "Cigna",
                Reason = "other",
                Notes = "test notes",
                DateOfService = DateTime.Now,
                IsEscalated = false,
                
                Requestor = new Api.DTOs.Requestor { FirstName = "john", LastName = "xyz", PhoneNumber="123423516", Email = "test@email.com", Extension = "124624", Facility="test", Fax="1265213651" },
                PatientDetails = new Api.DTOs.PatientDetails { 
                    ID = "123", 
                    Name = "john",
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
            //Act
             var  mappedModel = _mapper.Map<CareCoordinationRequestModel>(request);

            //Assert
            Assert.NotNull(mappedModel);
            Assert.Equal(request.EpisodeId, mappedModel.EpisodeId);
            Assert.Equal(request.CompanyId, mappedModel.CompanyId);
            Assert.Equal(request.Notes, mappedModel.Notes);
            Assert.Equal(request.HealthPlan, mappedModel.HealthPlan);
            Assert.Equal(request.IsEscalated, mappedModel.IsEscalated);
            Assert.Equal(request.Requestor.FirstName, mappedModel?.Requestor?.FirstName);
            Assert.Equal(request.PatientDetails.ID, mappedModel?.PatientDetails?.ID);
        }
    }
}
