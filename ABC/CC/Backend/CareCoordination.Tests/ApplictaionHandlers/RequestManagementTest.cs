using CareCoordination.Application.Abstracts.DALInterfaces;
using CareCoordination.Application.Abstracts.HandlerInterfaces;
using CareCoordination.Application.Abstracts.ServiceInterfaces;
using CareCoordination.Application.Handlers;
using CareCoordination.Application.Models;
using CareCoordination.Domain.Validators;
using Moq;
using Xunit;

namespace CareCoordination.Tests.ApplictaionHandlers
{
    public class RequestManagementTest
    {
        private readonly Mock<IRequestManagement> _requestManagementService;
        private readonly RequestCaseManagement _requestCasepManagement;
        public RequestManagementTest()
        {
            _requestManagementService = new Mock<IRequestManagement>();
            _requestCasepManagement = new RequestCaseManagement(_requestManagementService.Object);
        }

        public static CaseManagementModel MockCaseManagement()
        {
            var request = new CaseManagementModel()
            {
                RequestId = "C1",
                MissedStartOfCare = true,
                MissedStartOfCareReason = "Test",
                CaseStatus = "Close",
                IsEscalated = true,
                FollowUPDate = DateTime.UtcNow,
                FollowUPNote = "Note",
                Notes = "Test",
                CreatedDate = DateTime.UtcNow,
                FirstName = "Test",
                LastName = "Test",
                PhoneNumber = "9848574574",
                Extension = "98734",
                Email = "Test@evicore.com",
                RequestType="MSOC",
                DateOfService = DateTime.UtcNow,
                CloseReason = "Test",
            };
            return request;
        }

        [Fact]
        public async Task UpdateMissedStartOfCare()
        {
            //arange
            var request = MockCaseManagement();
            var expectedResponse = new CaseManagementResponseModel{IsSuccess = true};
            _requestManagementService.Setup(s => s.UpdateMissedStartOfCareAsync(It.IsAny<CaseManagementModel>())).ReturnsAsync(expectedResponse);
            //act
            var result = await _requestCasepManagement.UpdateMissedStartOfCareAsync(request);
            //assert
            Assert.NotNull(result);
            Assert.Equal(expectedResponse, result);
            _requestManagementService.Verify(s => s.UpdateMissedStartOfCareAsync(It.IsAny<CaseManagementModel>()), Times.Once);
        }
        [Fact]
        public async Task UpdateCaseStatus()
        {
            //arange
            var request = MockCaseManagement();
            var expectedResponse = new CaseManagementResponseModel { IsSuccess = true };
            _requestManagementService.Setup(s => s.UpdateCaseStatusAsync(It.IsAny<CaseManagementModel>())).ReturnsAsync(expectedResponse);
            //act
            var result = await _requestCasepManagement.UpdateCaseStatusAsync(request);
            //assert
            Assert.NotNull(result);
            Assert.Equal(expectedResponse, result);
            _requestManagementService.Verify(s => s.UpdateCaseStatusAsync(It.IsAny<CaseManagementModel>()), Times.Once);
        }
        [Fact]
        public async Task UpdateIsEscalateRequest()
        {
            //arange
            var request = MockCaseManagement();
            var expectedResponse = new CaseManagementResponseModel { IsSuccess = true };
            _requestManagementService.Setup(s => s.UpdateIsEscalateRequestAsync(It.IsAny<CaseManagementModel>())).ReturnsAsync(expectedResponse);
            //act
            var result = await _requestCasepManagement.UpdateIsEscalateRequestAsync(request);
            //assert
            Assert.NotNull(result);
            Assert.Equal(expectedResponse, result);
            _requestManagementService.Verify(s => s.UpdateIsEscalateRequestAsync(It.IsAny<CaseManagementModel>()), Times.Once);
        }
        [Fact]
        public async Task UpdateFollowUpDate()
        {
            //arange
            var request = MockCaseManagement();
            var expectedResponse = new CaseManagementResponseModel { IsSuccess = true };
            _requestManagementService.Setup(s => s.UpdateFollowUpDateAsync(It.IsAny<CaseManagementModel>())).ReturnsAsync(expectedResponse);
            //act
            var result = await _requestCasepManagement.UpdateFollowUpDateAsync(request);
            //assert
            Assert.NotNull(result);
            Assert.Equal(expectedResponse, result);
            _requestManagementService.Verify(s => s.UpdateFollowUpDateAsync(It.IsAny<CaseManagementModel>()), Times.Once);
        }
        [Fact]
        public async Task AddNote()
        {
            //arange
            var request = MockCaseManagement();
            var expectedResponse = new CaseManagementResponseModel { IsSuccess = true };
            _requestManagementService.Setup(s => s.AddNoteAsync(It.IsAny<CaseManagementModel>())).ReturnsAsync(expectedResponse);
            //act
            var result = await _requestCasepManagement.AddNoteAsync(request);
            //assert
            Assert.NotNull(result);
            Assert.Equal(expectedResponse, result);
            _requestManagementService.Verify(s => s.AddNoteAsync(It.IsAny<CaseManagementModel>()), Times.Once);
        }
        [Fact]
        public async Task UpdateCaseManager()
        {
            //arange
            var request = MockCaseManagement();
            var expectedResponse = new CaseManagementResponseModel { IsSuccess = true };
            _requestManagementService.Setup(s => s.UpdateCaseManagerAsync(It.IsAny<CaseManagementModel>())).ReturnsAsync(expectedResponse);
            //act
            var result = await _requestCasepManagement.UpdateCaseManagerAsync(request);
            //assert
            Assert.NotNull(result);
            Assert.Equal(expectedResponse, result);
            _requestManagementService.Verify(s => s.UpdateCaseManagerAsync(It.IsAny<CaseManagementModel>()), Times.Once);
        }
    }
}
