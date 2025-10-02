using AutoMapper;
using CareCoordination.Application.Models;
using CareCoordination.Application.Models.SiteRequestModels;
using CareCoordination.Domain.Models;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CareCoordination.Services.Mappers
{
    [ExcludeFromCodeCoverage]
    public class ServicesMappingProfile : Profile
    {
        public ServicesMappingProfile() {
            ConfigureMappings();
        }

        private void ConfigureMappings()
        {
            CreateGetSitesResponseMapping();
        }

        private void CreateGetSitesResponseMapping()
        {
            CreateMap<GetSitesResponse, SearchResult>()
                .ForMember(dest => dest.MemberIPACode, opt => opt.MapFrom(src => src.IPACODE));
        }
    }
}
