using Microsoft.ApplicationInsights.DataContracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CareCoordination.Application.Logger
{
    public interface IApplicationLogger
    {
        void LogInformation(string message);
        void LogError(string errorMessage);
        void LogException(string exceptionMessage, Exception exception);
        void LogRequest(RequestTelemetry requestElement);
    }
}
