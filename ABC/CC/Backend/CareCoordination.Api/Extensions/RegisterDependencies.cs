using CareCoordination.Application;
using CareCoordination.DAL;
using CareCoordination.Services;

namespace CareCoordination.Api.Extensions
{
    public static class RegisterDependencies
    {
        public static void RegisterServices(this IServiceCollection services)
        {
            // Register application layer dependencies
            services.RegisterApplicationDependencies();
            services.RegisterServicesDependencies();

            // Register infrastructure layer dependencies
            services.RegisterDALDependencies();
        }
    }
}
