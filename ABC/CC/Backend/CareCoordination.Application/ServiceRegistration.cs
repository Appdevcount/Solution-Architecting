using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Threading.Tasks;
using CareCoordination.Application.Abstracts.DALInterfaces;
using CareCoordination.Application.Abstracts.HandlerInterfaces;
using CareCoordination.Application.Abstracts.ServiceInterfaces;
using CareCoordination.Application.Handlers;
using Microsoft.Extensions.DependencyInjection;

namespace CareCoordination.Application
{
    [ExcludeFromCodeCoverage]
    public static class ServiceRegistration
    {
        public static void RegisterApplicationDependencies(this IServiceCollection services)
        {

            // Register services
            services.AddTransient<IPatientLookupManagement, PatientLookupManagement>();

            services.AddTransient<IRequestCreationManagement, RequestCreationManagement>();
            services.AddTransient<ITokenManagement, TokenManagement>();
            services.AddTransient<IUserManagement, UserManagement>();

            services.AddTransient<IRequestSearchManagement, RequestSearchManagement>();
            services.AddTransient<IRequestViewLookupManagement, RequestViewLookupManagement>();

            services.AddTransient<ICaseManagement, RequestCaseManagement>();
            services.AddTransient<IDashboardViewManagement, DashboardViewManagement>();

            services.AddTransient<ITokenManagement,TokenManagement>();
            services.AddTransient<IAttachmentManagement, AttachmentManagement>();
            services.AddScoped<IUserManagement,UserManagement>();
            

            services.AddTransient<ISiteLookupManagement, SiteLookupManagement>();
            services.AddTransient<IHistoricalCaseDataManagement,HistoricalCaseDataManagement>();

            // Add other infrastructure services here
        }
    }
}