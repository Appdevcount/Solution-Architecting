using Microsoft.ApplicationInsights;
using Microsoft.ApplicationInsights.DataContracts;
using Microsoft.ApplicationInsights.Extensibility;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CareCoordination.Application.Logger
{
    public class AppInsightsLogger : IApplicationLogger
    {
        private readonly TelemetryClient telemetryClient;

        public AppInsightsLogger(IConfiguration configuration)
        {
            var telementryConfig = new TelemetryConfiguration();
            telementryConfig.ConnectionString = configuration["ApplicationInsights:ConnectionString"];
            telemetryClient = new TelemetryClient(telementryConfig);
        }
        public void LogError(string errorMessage)
        {
            telemetryClient.TrackTrace($"{"CareCordination API"} {errorMessage}");
        }
        public void LogException(string exceptionMessage, Exception exception)
        {
            telemetryClient.TrackException(new Exception($"{"CareCordination API"} {exceptionMessage}", exception));
        }
        public void LogInformation(string message)
        {
            telemetryClient.TrackTrace($"{"CareCordination API"} {message}");
        }
        public void LogRequest(RequestTelemetry requestElement)
        {
            telemetryClient.TrackRequest(requestElement);
        }
    }
}
