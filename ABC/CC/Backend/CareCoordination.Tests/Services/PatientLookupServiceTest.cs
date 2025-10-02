using CareCoordination.Application.Models;
using CareCoordination.Services.Implementation;
using Moq.Protected;
using Moq;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Xunit;
using Microsoft.Extensions.Configuration;
using System.Text.Json.Nodes;
using System.Text.Json.Serialization;

namespace CareCoordination.Tests.Services
{
    public class PatientLookupServiceTest
    {
        private readonly Mock<IHttpClientFactory> _httpClientFactoryMock;
        private readonly Mock<IConfiguration> _configMock;
        private readonly PatientLookupService _service;

        public PatientLookupServiceTest()
        {
            _httpClientFactoryMock = new Mock<IHttpClientFactory>();
            _configMock = new Mock<IConfiguration>();

            _configMock.Setup(c => c.GetSection("MemberProcedureEligibility:MemberProcedureEligibilityApimUrl").Value)
                .Returns("https://example.com/");
            _configMock.Setup(c => c.GetSection("MemberProcedureEligibility:MemberProcedureEligibilityApimKey").Value)
                .Returns("fake-key");
            _configMock.Setup(c => c.GetSection("MemberProcedureEligibility:memberProcedureEligibilityApimName").Value)
                .Returns("fake-name");
            _configMock.Setup(c => c.GetSection("MemberProcedureEligibility:OcpApimSubscriptionKey").Value)
                .Returns("fake-subscription-key");
            _configMock.Setup(c => c.GetSection("MemberEligibility:MemberEligibilityUpadsRequestUrl").Value)
               .Returns("https://example.com/membereligibility");

            _service = new PatientLookupService(_configMock.Object, _httpClientFactoryMock.Object);
        }

        [Fact]
        public async Task GetMemberDetails_ReturnsPatientDetailsResponse_Success()
        {
            // Arrange
            var requestModel = new PatientLookupRequestModel
            {
                PatientID = "11111",
                PatientDob = "09011998",
                PatientLastName = "John"
            };

            var expectedResponse = new List<PatientDetailsResponse>
        {
            new PatientDetailsResponse { IsSuccess = true }
        };

            var responseMessage = new HttpResponseMessage
            {
                StatusCode = HttpStatusCode.OK,
                Content = new StringContent(JsonConvert.SerializeObject(expectedResponse))
            };

            var httpMessageHandlerMock = new Mock<HttpMessageHandler>();
            httpMessageHandlerMock.Protected()
                .Setup<Task<HttpResponseMessage>>("SendAsync", ItExpr.IsAny<HttpRequestMessage>(), ItExpr.IsAny<CancellationToken>())
                .ReturnsAsync(responseMessage);

            var httpClient = new HttpClient(httpMessageHandlerMock.Object);
            _httpClientFactoryMock.Setup(_ => _.CreateClient(It.IsAny<string>())).Returns(httpClient);

            // Act
            var result = await _service.GetMemberDetails(requestModel);

            // Assert
            Assert.NotNull(result);
            Assert.Single(result);
            Assert.True(result[0].IsSuccess);
        }

        [Fact]
        public async Task GetMemberDetails_ReturnsEmptyList_WhenResponseIsNotSuccess()
        {
            // Arrange
            var requestModel = new PatientLookupRequestModel
            {
                PatientID = "11111",
                PatientDob = "09011998",
                PatientLastName = "John"
            };

            var responseMessage = new HttpResponseMessage
            {
                StatusCode = HttpStatusCode.BadRequest,
                Content = new StringContent("Bad Request")
            };

            var httpMessageHandlerMock = new Mock<HttpMessageHandler>();
            httpMessageHandlerMock.Protected()
                .Setup<Task<HttpResponseMessage>>("SendAsync", ItExpr.IsAny<HttpRequestMessage>(), ItExpr.IsAny<CancellationToken>())
                .ReturnsAsync(responseMessage);

            var httpClient = new HttpClient(httpMessageHandlerMock.Object);
            _httpClientFactoryMock.Setup(_ => _.CreateClient(It.IsAny<string>())).Returns(httpClient);

            // Act
            var result = await _service.GetMemberDetails(requestModel);

            // Assert
            Assert.NotNull(result);
            Assert.Empty(result);
        }
        [Fact]
        public async Task GetMemberEligibility_ReturnsResponse_Success()
        {
            // Arrange
            var requestModel = new MemberEligibilityRequestModel
            {
                Qualifiers = new MemberEligibility
                {
                    ClientSystem = "ImageOne",
                    DOS = DateTime.Now,
                    InsCarrier = " Cigna",
                    PatientDOB = "25/01/1887",
                    PatientID = "A12345678",
                    PatientMemberCode = "1",
                    ReviewType = "Procedureeligibility",
                    Workflow = "CC",
                    CompanyID = "1",
                    JurisdictionState = "1",
                    CPLNTP = "1",
                    CPTCode = "1",
                    DMEBenefit = "1",
                    GroupNumber = "1",
                    Environment = "",
                    InsPlanType = "1",
                    Modality = "1",
                    PatientState = "1"
                }
            };

            var jsonResponse = "{\"CompanyID\":\"\",\"InsCarrier\":\"CIGNA\"," +
                "\"CPLNTP\":\"\",\"PlanTypeEligible\":\"N\",\"DOS\":\"02/06/2025\"," +
                "\"CPTCode\":\"\",\"CaseBuild\":\"Yes\",\"MemberInScope\":\"TRUE\"}";


            var responseMessage = new HttpResponseMessage
            {
                StatusCode = HttpStatusCode.OK,
                Content = new StringContent(jsonResponse)
            };

            var httpMessageHandlerMock = new Mock<HttpMessageHandler>();
            httpMessageHandlerMock.Protected()
                .Setup<Task<HttpResponseMessage>>("SendAsync", ItExpr.IsAny<HttpRequestMessage>(), ItExpr.IsAny<CancellationToken>())
                .ReturnsAsync(responseMessage);

            var httpClient = new HttpClient(httpMessageHandlerMock.Object);
            _httpClientFactoryMock.Setup(_ => _.CreateClient(It.IsAny<string>())).Returns(httpClient);

            // Act
            var result = await _service.GetMemberEligibility(requestModel);

            // Assert
            Assert.NotNull(result);
            Assert.Single(result);
        }
        [Fact]
        public async Task GetMemberEligibility_ShouldThrowException_WhenAPIReturnsEmptyResponse()
        {
            // Arrange
            var requestModel = new MemberEligibilityRequestModel
            {
                Qualifiers = new MemberEligibility
                {
                    ClientSystem = "ImageOne",
                    DOS = DateTime.Now,
                    InsCarrier = " Cigna",
                    PatientDOB = "25/01/1887",
                    PatientID = "A12345678",
                    PatientMemberCode = "1",
                    ReviewType = "Procedureeligibility",
                    Workflow = "CC",
                    CompanyID = "1",
                    JurisdictionState = "1",
                    CPLNTP = "1",
                    CPTCode = "1",
                    DMEBenefit = "1",
                    GroupNumber = "1",
                    Environment = "",
                    InsPlanType = "1",
                    Modality = "1",
                    PatientState = "1"
                }
            };

            var jsonResponse = "";


            var responseMessage = new HttpResponseMessage
            {
                StatusCode = HttpStatusCode.OK,
                Content = new StringContent(jsonResponse)
            };

            var httpMessageHandlerMock = new Mock<HttpMessageHandler>();
            httpMessageHandlerMock.Protected()
                .Setup<Task<HttpResponseMessage>>("SendAsync", ItExpr.IsAny<HttpRequestMessage>(), ItExpr.IsAny<CancellationToken>())
                .ReturnsAsync(responseMessage);

            var httpClient = new HttpClient(httpMessageHandlerMock.Object);
            _httpClientFactoryMock.Setup(_ => _.CreateClient(It.IsAny<string>())).Returns(httpClient);

            // Act
            var exception = await Assert.ThrowsAsync<ArgumentException>(() => _service.GetMemberEligibility(requestModel));

            // Assert
            Assert.Equal("Empty response from external API", exception.Message);
        }
        [Fact]
        public async Task GetMemberEligibility_ShouldThrowJsonException_WhenAPIReturnNull()
        {
            // Arrange
            var requestModel = new MemberEligibilityRequestModel
            {
                Qualifiers = new MemberEligibility
                {
                    ClientSystem = "ImageOne",
                    DOS = DateTime.Now,
                    InsCarrier = " Cigna",
                    PatientDOB = "25/01/1887",
                    PatientID = "A12345678",
                    PatientMemberCode = "1",
                    ReviewType = "Procedureeligibility",
                    Workflow = "CC",
                    CompanyID = "1",
                    JurisdictionState = "1",
                    CPLNTP = "1",
                    CPTCode = "1",
                    DMEBenefit = "1",
                    GroupNumber = "1",
                    Environment = "",
                    InsPlanType = "1",
                    Modality = "1",
                    PatientState = "1"
                }
            };

            string? jsonResponse = "null";


            var responseMessage = new HttpResponseMessage
            {
                StatusCode = HttpStatusCode.OK,
                Content = new StringContent(jsonResponse)
            };

            var httpMessageHandlerMock = new Mock<HttpMessageHandler>();
            httpMessageHandlerMock.Protected()
                .Setup<Task<HttpResponseMessage>>("SendAsync", ItExpr.IsAny<HttpRequestMessage>(), ItExpr.IsAny<CancellationToken>())
                .ReturnsAsync(responseMessage);

            var httpClient = new HttpClient(httpMessageHandlerMock.Object);
            _httpClientFactoryMock.Setup(_ => _.CreateClient(It.IsAny<string>())).Returns(httpClient);

            // Act
            var exception = await Assert.ThrowsAsync<JsonException>(() => _service.GetMemberEligibility(requestModel));

            // Assert
            Assert.Equal("Deserialize object is null", exception.Message);
        }

    }
}