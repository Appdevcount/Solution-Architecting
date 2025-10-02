using System.Diagnostics.CodeAnalysis;

namespace CareCoordination.Api.Middleware
{
    [ExcludeFromCodeCoverage]
    public class ApiKeyMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IConfiguration _configuration;

        public ApiKeyMiddleware(RequestDelegate next, IConfiguration configuration)
        {
            _next = next;
            _configuration = configuration;
        }

        public async Task Invoke(HttpContext context)
        {
            if (!context.Request.Headers.TryGetValue("X-API-KEY", out var extractedApiKey) ||
                extractedApiKey != _configuration["ApiKey"])
            {
                context.Response.StatusCode = 401;
                await context.Response.WriteAsync("Invalid API Key");
                return;
            }

            await _next(context);

        }
    }
}
