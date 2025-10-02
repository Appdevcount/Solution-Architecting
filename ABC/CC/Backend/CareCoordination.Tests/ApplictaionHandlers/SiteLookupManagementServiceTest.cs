using CareCoordination.Application.Abstracts.ServiceInterfaces;
using CareCoordination.Application.Handlers;
using CareCoordination.Application.Models.SiteRequestModels;
using Moq;
using Xunit;

namespace CareCoordination.Tests.ApplictaionHandlers
{
    public class SiteLookupManagementServiceTest
    {
        private readonly Mock<ISiteLookupService> _siteLookupService;
        private readonly SiteLookupManagement _siteLookupManagement;
        public SiteLookupManagementServiceTest()
        {
            _siteLookupService = new Mock<ISiteLookupService>();
            _siteLookupManagement = new SiteLookupManagement(_siteLookupService.Object);
        }

        [Fact]
        public async Task GetSiteDetails_ReturnPatientDetails()
        {
            //Arange
            var request = new GetSiteDetailsRequestModel
            {
                RequestId = "User"
            };
            var expectedResponse = new SiteSearchResponse
            {
                IsSuccess = true
            };
            _siteLookupService.Setup(s => s.GetSiteDetails(It.IsAny<GetSiteDetailsRequestModel>())).ReturnsAsync(expectedResponse);

            //Act
            var result = await _siteLookupManagement.GetSiteDetails(request);

            //Assert
            Assert.NotNull(result);
        }

        [Fact]
        public void UpsertSiteDetails_ReturnPatientDetails()
        {
            //Arange
            var request = new UpdateSiteDetailsRequestModel
            {
                CareCoordinationEpisodeId = "A123456789"
            };
            var expectedResponse = "SUCCESS";

            _siteLookupService.Setup(s => s.UpsertSiteDetails(It.IsAny<UpdateSiteDetailsRequestModel>())).Returns(expectedResponse);

            //Act
            var result = _siteLookupManagement.UpsertSiteDetails(request);

            //Assert
            Assert.NotNull(result);
        }
    }
}
