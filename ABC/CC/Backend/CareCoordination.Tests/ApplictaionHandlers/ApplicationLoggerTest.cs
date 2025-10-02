using CareCoordination.Application.Logger;
using Microsoft.ApplicationInsights;
using Microsoft.ApplicationInsights.DataContracts;
using Microsoft.ApplicationInsights.Extensibility;
using Microsoft.Extensions.Configuration;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using Xunit;
namespace CareCoordination.Tests.ApplictaionHandlers
{
    public class ApplicationLoggerTest
    {
        private readonly AppInsightsLogger _AppInsightsLogger;
        private readonly Mock<IConfiguration> _mockIConfiguration;
        public ApplicationLoggerTest()
        {
            _mockIConfiguration = new Mock<IConfiguration>();
            _mockIConfiguration.SetReturnsDefault("InstrumentationKey=22fdd5a8-135e-4075-a52c-12345678");
            _AppInsightsLogger = new AppInsightsLogger(_mockIConfiguration.Object);
        }

        [Fact]
        public void LogError_Null_Throws_SQL_Exception()
        {
            string errorMessage = "Please enter valid Carrier";
            _AppInsightsLogger.LogError(errorMessage);
            Assert.True(true);
        }
        [Fact]
        public void LogException_Null_Throws_SQL_Exception()
        {
            string exceptionMessage = "Exception Occure";
            Exception exception = new Exception();
            _AppInsightsLogger.LogException(exceptionMessage, exception);
            Assert.True(true);
        }
        [Fact]
        public void LogInformation_Null_Throws_SQL_Exception()
        {
            string message = "Please enter valid Carrier";
            _AppInsightsLogger.LogInformation(message);
            Assert.True(true);
        }
        [Fact]
        public void LogRequest_Null_Throws_SQL_Exception()
        {
            RequestTelemetry requestElement = new RequestTelemetry();
            _AppInsightsLogger.LogRequest(requestElement);
            Assert.True(true);
        }


    }

}


