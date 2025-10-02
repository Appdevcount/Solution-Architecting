using CareCoordination.Application.Abstracts.DALInterfaces;
using CareCoordination.Application.Abstracts.HandlerInterfaces;
using CareCoordination.Application.Handlers;
using CareCoordination.DAL.Implementation;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Data;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Threading.Tasks;

namespace CareCoordination.DAL
{
    [ExcludeFromCodeCoverage]
    public static class ServiceRegistration 
    {
        public static void RegisterDALDependencies(this IServiceCollection services)
        {
            // Register repositories
            services.AddTransient<IRequestSearch, RequestSearch>();
            services.AddTransient<IRequestCreate, RequestCreation>();
            services.AddTransient<IProcedureCodeSearchAndUpdate, ProcedureCodeSearchAndUpdate>();


            services.AddTransient<IDashboardView, DashboardView>();
            services.AddTransient<IPatientRepository,PatientRepository>();

            services.AddScoped<IDbService, DbService>();
            services.AddTransient<IRequestManagement, RequestManagement>();
            services.AddScoped<ITokenRepository,TokenRepository>();
            services.AddScoped<IUserRepository,UserRepository>();
            services.AddTransient<IAttachmentDetails, AttachmentDetails>();
            services.AddTransient<ISiteRepository, SiteRepository>();
            // Register services
            services.AddScoped<IDbConnection>(sp =>
            {
                var configuration = sp.GetRequiredService<IConfiguration>();
                var connectioString = configuration.GetConnectionString("PreAuthin");
                return new SqlConnection(connectioString);
            });

            // Add other infrastructure services here
        }
    }
}