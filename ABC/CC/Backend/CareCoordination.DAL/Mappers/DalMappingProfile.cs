using AutoMapper;
using CareCoordination.Api.DTOs;
using CareCoordination.Domain.Models;
using CareCoordination.Domain.Entities;
using CareCoordination.Application.Models;

namespace CareCoordination.DAL.Mappers
{
    public class DalMappingProfile : Profile
    {
        public DalMappingProfile()
        {
            ConfigureMappings();

            CreateMap<UserRolesEntity,User>()
                .ForMember(dest => dest.UserId,opt => opt.MapFrom(src => src.user_ID))
                .ForMember(dest => dest.Password,opt => opt.MapFrom(src => src.user_num))
                .ForMember(dest => dest.Username,opt => opt.MapFrom(src => src.user_name))
                .ForMember(dest => dest.Role,opt => opt.MapFrom(src => src.RoleType));

            CreateMap<CareCoordinationAuthTokenEntity,TokenResponse>()
                .ForMember(dest => dest.CareCoordinationTokenId,opt => opt.MapFrom(src => src.CareCoordinationTokenId))
                .ForMember(dest => dest.RefreshToken,opt => opt.MapFrom(src => src.RefreshToken))
                .ForMember(dest => dest.UserName,opt => opt.MapFrom(src => src.UserName))
                .ForMember(dest => dest.Expiration,opt => opt.MapFrom(src => src.Expiration))
                .ForMember(dest => dest.CreatedDate,opt => opt.MapFrom(src => src.CreatedDate));

            
        }

        private void ConfigureMappings()
        {
            CreateRequestSearchResultMapping();
            CreateCareCoordinationDetailsMapping();
            CreateNoteMapping();
            CreateAttachmentMapping();
            CreateCptCodeModelMapping();
            CreateCareCoordinationActivityMapping();
            CreateProcedureCodeMapping();
        }

        private void CreateRequestSearchResultMapping()
        {
            CreateMap<RequestSearchResultEntity, RequestSearchResult>()
                .ForMember(dest => dest.CareCoordinationEpisodeDate, opt => opt.MapFrom(src => ParseDate(src.CareCoordinationEpisodeDate)))
                .ForMember(dest => dest.DateOfService, opt => opt.MapFrom(src => ParseDate(src.DateOfService)))
                .ForMember(dest => dest.DateOfClosing, opt => opt.MapFrom(src => ParseDate(src.DateOfClosing)))
                .ForMember(dest => dest.CreateDate, opt => opt.MapFrom(src => ParseDate(src.CreateDate)))
                .ForMember(dest => dest.PatientDetails, x => x.MapFrom(src => new Patient
                {
                    ID = src.PatientID,
                    Name = src.PatientName,
                    DateOfBirth = ParseDate(src.PatientDOB)
                }));
        }

        private void CreateCareCoordinationDetailsMapping()
        {
            CreateMap<CareCoordinationRequestEntity, CareCoordinationDetails>()
                .ForMember(dest => dest.CareCoordinationEpisodeDate, opt => opt.MapFrom(src => ParseDate(src.CareCoordinationEpisodeDate)))
                .ForMember(dest => dest.DateOfService, opt => opt.MapFrom(src => ParseDate(src.DateOfService)))
                .ForMember(dest => dest.DateOfClosing, opt => opt.MapFrom(src => ParseDate(src.DateOfClosing)))
                .ForMember(dest => dest.CreateDate, opt => opt.MapFrom(src => ParseDate(src.CreateDate)))
                .ForMember(dest => dest.Requester, x => x.MapFrom(src => MapRequester(src)))
                .ForMember(dest => dest.CaseManager, x => x.MapFrom(src => MapCaseManager(src)))
                .ForMember(dest => dest.PatientDetails, x => x.MapFrom(src => MapPatientDetails(src)))
                .ForMember(dest => dest.Site, x => x.MapFrom(src => MapSite(src)))
                .ForMember(dest => dest.FollowUp, x => x.MapFrom(src => MapFollowUp(src)));
        }

        private static DateTime? ParseDate(string? date)
        {
            return string.IsNullOrEmpty(date) ? (DateTime?)null : DateTime.Parse(date, System.Globalization.CultureInfo.InvariantCulture);
        }

        private static RequesterInformation MapRequester(CareCoordinationRequestEntity src)
        {
            return new RequesterInformation
            {
                FirstName = src.RequesterFName,
                LastName = src.RequesterLName,
                ContactNumber = src.RequesterContactNo,
                ContactExtension = src.RequesterContactExt,
                FaxNumber = src.RequesterFaxNo,
                Facility = src.RequesterFacility,
                Email = src.RequesterEmailID
            };
        }

        private static CaseManager MapCaseManager(CareCoordinationRequestEntity src)
        {
            return new CaseManager
            {
                FirstName = src.CaseManagerFName,
                LastName = src.CaseManagerLName,
                PhoneNumber = src.CaseManagerPhoneNo,
                Extention = src.CaseManagerExtention,
                Email = src.CaseManagerEmail
            };
        }

        private static Application.Models.PatientDetails MapPatientDetails(CareCoordinationRequestEntity src)
        {
            return new Application.Models.PatientDetails
            {
                PatientID = src.PatientID,
                Name = src.PatientName,
                DateOfBirth = ParseDate(src.PatientDOB),
                MemberCode = src.PatientMemberCode,
                GroupNumber = src.GroupNumber,
                PlanType = src.PlanType,
                LineOfBusiness = src.LineOfBusiness,
                Language = src.Language,
                PatientPlanType = src.PatientPlanType,
                Entity = src.PatientEntity,
                Category = src.Category,
                IPA = src.PatientIPA,
                PatientIdent = src.PatientIdent,
                Email = src.Email,
                CellPhone = src.CellPhone,
                JurisdictionState = src.JurisdictionState,
                TIT19 = src.TIT19,
                Calculated_PatientID_PatientMemberCode_GroupNumber = src.Calculated_PatientID_PatientMemberCode_GroupNumber,
                CaseFactor = src.CaseFactor,
                PUSRDF = src.PatientPUSRDF,
                FundType = src.FundType,
                ERISA = src.ERISA,
                EXTID = src.EXTID,
                StartDate = ParseDate(src.MemberStartDate),
                MemberQuickCreate = src.MemberQuickCreate,
                PatientSex = src.PatientSex,
                PatientAddr1 = src.PatientAddr1,
                PatientAddr2 = src.PatientAddr2,
                PatientCity = src.PatientCity,
                PatientState = src.PatientState,
                PatientZip = src.PatientZip
            };
        }

        private static Site MapSite(CareCoordinationRequestEntity src)
        {
            return new Site
            {
                OAOSiteID = src.OAOSiteID,
                NonParSiteID = src.NonParSiteID,
                OldSiteID = src.OldSiteID,
                Name = src.SiteName,
                Addr1 = src.SiteAddr1,
                Addr2 = src.SiteAddr2,
                City = src.SiteCity,
                State = src.SiteState,
                Zip = src.SiteZip,
                Phone = src.SitePhone,
                Fax = src.SiteFax,
                Spec1 = src.SiteSpec1,
                Spec2 = src.SiteSpec2,
                SpecDescription1 = src.SiteSpecDesc1,
                SpecDescription2 = src.SiteSpecDesc2,
                AlternateID = src.SiteAlternateID,
                NYMIPar = src.SiteNYMIPar,
                SteeragePosition = src.SteeragePosition,
                NPI = src.NPI,
                SiteIdent = src.SiteIdent,
                SelectionMethodID = src.SelectionMethodID,
                Email = src.SiteEmail,
                PUSRDF = src.PUSRDF,
                IPA = src.SiteIPA,
                Entity = src.SiteEntity,
                SiteType = src.SiteType,
                PhysicianName = src.PhysicianName
            };
        }

        private static FollowUpDetails MapFollowUp(CareCoordinationRequestEntity src)
        {
            return new FollowUpDetails
            {
                Notes = src.FollowUpNotes,
                FollowUpDate = ParseDate(src.FollowUpDate)
            };
        }

        private void CreateNoteMapping()
        {
            CreateMap<NoteEntity, Note>()
                .ForMember(dest => dest.CreatedDate, opt => opt.MapFrom(src => ParseDate(src.CreatedDate)));
        }

        private void CreateAttachmentMapping()
        {
            CreateMap<AttachmentEntity, Attachment>()
                .ForMember(dest => dest.ReceivedDate, opt => opt.MapFrom(src => ParseDate(src.ReceivedDate)))
                .ForMember(dest => dest.CreatedDate, opt => opt.MapFrom(src => ParseDate(src.CreatedDate)));
        }

        private void CreateCptCodeModelMapping()
        {
            CreateMap<CptCodeEntity, CptCodeModel>()
                .ForMember(dest => dest.SimplifiedDescription, opt => opt.MapFrom(src => src.CPTSimplifiedDesc))
                .ForMember(dest => dest.CreatedDate, opt => opt.MapFrom(src => ParseDate(src.CreatedDate)));
        }

        private void CreateCareCoordinationActivityMapping()
        {
            CreateMap<CareCoordinationActivityEntity, CareCoordinationActivity>()
                .ForMember(dest => dest.CreatedDate, opt => opt.MapFrom(src => string.IsNullOrEmpty(src.CreatedDate) ? (DateTime?)null : DateTime.Parse(src.CreatedDate)));

        }
        private void CreateProcedureCodeMapping()
        {
            CreateMap<ProcedureCodeSearchResponseEntity, ProcedureCodeDetails>();

            CreateMap<IEnumerable<ProcedureCodeSearchResponseEntity>, ProcedureCodeSearchResponseModel>()
                .ForMember(dest => dest.ProcedureCodeDetails, x => x.MapFrom(src => src));
        }
    }
}
