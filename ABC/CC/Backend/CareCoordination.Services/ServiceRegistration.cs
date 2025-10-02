using System.Diagnostics.CodeAnalysis;
using CareCoordination.Services.Implementation;
using System.Linq;
using System.Threading.Tasks;
using CareCoordination.Application.Abstracts.HandlerInterfaces;
using CareCoordination.Application.Abstracts.ServiceInterfaces;
using CareCoordination.Application.Handlers;
using CareCoordination.Services.Implementation;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.DependencyInjection;

namespace CareCoordination.Services
{
    [ExcludeFromCodeCoverage]
    public static class ServiceRegistration 
    {
        public static void RegisterServicesDependencies(this IServiceCollection services)
        {
            // Register services
            services.AddHttpClient();
            services.AddMemoryCache();
            services.AddTransient<IPatientLookupService, PatientLookupService>();
            services.AddTransient<ISiteLookupService, SiteLookupService>();
            services.AddTransient<IHttpClient, HttpClientWrapper>();
            services.AddTransient<IFileHandler, FileHandler>();
            services.AddTransient<IApiTokenCacheClient, ApiTokenCacheClient>();
            
            services.AddTransient<ITokenService, TokenService>();
            services.AddTransient<IUserService, UserService>();
            services.AddTransient<IHistoricalCaseDataService, HistoricalCaseDataService>();
            // Add other infrastructure services here
        }
    }
}