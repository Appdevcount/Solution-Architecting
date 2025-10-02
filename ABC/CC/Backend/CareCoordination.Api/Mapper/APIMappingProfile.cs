using AutoMapper;
using CareCoordination.Api.DTOs;
using CareCoordination.Application.Models;
using CareCoordination.Domain.Models;
using System.Reflection;

namespace CareCoordination.Api.Mapper
{
    public class ApiMappingProfile : Profile
    {
        public ApiMappingProfile()
        {
            CreateMap<CareCoordinationRequest, CareCoordinationRequestModel>();

            CreateMap<DTOs.Requestor, Application.Models.Requestor>();

            CreateMap<DTOs.PatientDetails, Application.Models.PatientDetail>();

            CreateMap<CareCoordinationResponseModel, CareCoordinationRequestCreationResponse>();

            CreateMap<SearchCareCoordinationRequest, GetCareCoordinationRequestModel>();

            CreateMap<PatientLookupRequest, PatientLookupRequestModel>();

            CreateMap<CareCoordinationRequest, CareCoordinationDomainModel>();

            CreateMap<DTOs.Requestor, Domain.Models.Requestor>();

            CreateMap<DTOs.PatientDetails, Domain.Models.PatientDetails>();

            CreateMap<ProcedureCodeSearchRequest, ProcedureCodeSearchRequestModel>();

            CreateMap<ProcedureCodeAddOrRemoveRequest, ProcedureCodeAddOrRemoveRequestModel>();

            CreateMap<CaseManagement, CaseManagementModel>();

            CreateMap<CaseManagement, CaseManagementEntity>();
            CreateMap<DashboardLoadRequest, DashboardLoadRequestModel>();
            CreateMap<DashboardCaseAssignmentRequest, DashboardCaseAssignmentRequestModel>();
            CreateMap<UploadedFile, UploadedFileModel>();
        }
    }
}