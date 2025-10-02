using CareCoordination.Application.Abstracts.DALInterfaces;
using CareCoordination.Application.Abstracts.ServiceInterfaces;
using CareCoordination.Application.Handlers;
using CareCoordination.Application.Models;
using CareCoordination.DAL.Implementation;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http.Results;
using Xunit;

namespace CareCoordination.Tests.ApplictaionHandlers
{
    public class AttachmentManagementTest
    {
        private readonly Mock<IFileHandler> _fileHandlerMock;
        private readonly Mock<IAttachmentDetails> _attachmentDetailsMock;
        private readonly AttachmentManagement _attachmentManagement;

        public AttachmentManagementTest()
        {
            _fileHandlerMock = new Mock<IFileHandler>();
            _attachmentDetailsMock = new Mock<IAttachmentDetails>();
            _attachmentManagement = new AttachmentManagement(_fileHandlerMock.Object, _attachmentDetailsMock.Object);
        }

        [Fact]
        public async Task GetFileByObjectId_Should_Return_File_When_Valid_ObjectId()
        {
            // Arrange
            var objectId = 12345;
            var file = new DownloadFilePropertiesModel { FileName = "test.txt", FileStreamContent = new System.IO.MemoryStream() };
            _fileHandlerMock.Setup(f => f.GetFileByObjectId(objectId)).ReturnsAsync(file);

            // Act
            var result = await _attachmentManagement.GetFileByObjectId(objectId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(file.FileName, result.FileName);
        }

        [Fact]
        public async Task GetFileByObjectId_Should_Return_Null_When_File_Not_Found()
        {
            // Arrange
            var objectId = 12345;
            _fileHandlerMock.Setup(f => f.GetFileByObjectId(objectId)).ReturnsAsync((DownloadFilePropertiesModel?)null);

            // Act
            var result = await _attachmentManagement.GetFileByObjectId(objectId);

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task DeleteFile_Should_Delete_File_When_Valid_ObjectId()
        {
            // Arrange
            var request = new DeleteFilePropertiesViewModel
            {
                ObjectId = 12345,
                EpisodeId = "1234679"
            };

            var response = new DeleteFilePropertiesModel { IsDeleted = true};
            _fileHandlerMock.Setup(f => f.DeleteFile(request)).ReturnsAsync(response);

            // Act
            var result = await _attachmentManagement.DeleteFile(request);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(response.IsDeleted,true);
        }

        [Fact]
        public void DeleteFile_Should_Return_False_When_File_Not_Found()
        {
            // Arrange
            var request = new DeleteFilePropertiesViewModel
            {
                ObjectId = 12345,
                EpisodeId = "1234679"
            };
            var response = new DeleteFilePropertiesModel { IsDeleted = false, Error="Unble to delete file" };
            _fileHandlerMock.Setup(f => f.DeleteFile(request)).ReturnsAsync(response);

            // Act
            var result = _attachmentManagement.DeleteFile(request);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(response.IsDeleted, false);
            
        }
        [Fact]
        public async Task DeleteFile_Should_throwException_When_ViewModel_is_null()
        {
            // Arrange
            var request = new DeleteFilePropertiesViewModel { ObjectId = 0, EpisodeId ="12345" };
            _fileHandlerMock.Setup(f => f.DeleteFile(request)).ThrowsAsync(new ArgumentException(""));

            // Act
            await Assert.ThrowsAsync<ArgumentException>(async() => await _attachmentManagement.DeleteFile(request));
        }

        [Fact]
        public void GetListOfObjects_Should_Return_FileList_When_Valid_EpisodeId()
        {
            // Arrange
            var episodeId = "CC1234567890";
            var fileList = new List<UploadedFileDataModel> 
            { 
                new UploadedFileDataModel
                {
                    Id = "1",
                    Filename = "file1.txt",
                    ObjectSize = 100,
                    Description = "test",
                    CreatedBy = null,
                    CreatedDate = null,
                    ObjectClassDescription = null,
                    EpisodeId = episodeId,
                    ObjectClassKey = null,
                    ObjectId = 0,
                    Policy = null,
                    RequestId = null
                } };
            _fileHandlerMock.Setup(f => f.GetListOfObjects(episodeId)).Returns(fileList);

            // Act
            var result = _attachmentManagement.GetListOfObjects(episodeId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(fileList.Count, result.Count);
        }

        [Fact]
        public void GetListOfObjects_Should_Return_EmptyList_When_No_Files_Found()
        {
            // Arrange
            var episodeId = "CC1234567890";
            _fileHandlerMock.Setup(f => f.GetListOfObjects(episodeId)).Returns(new List<UploadedFileDataModel>());

            // Act
            var result = _attachmentManagement.GetListOfObjects(episodeId);

            // Assert
            Assert.NotNull(result);
            Assert.Empty(result);
        }

        [Fact]
        public void PostToOVEndpoint_Should_Save_AttachmentDetails_When_File_Is_Valid()
        {
            // Arrange
            var fileToUpload = new UploadedFileModel {
                Filename = "test.txt",
                EpisodeId = "EP123",
                DocumentType = "TypeA",
                file = null,
                UserName = null
            };
            var uploadedFileProperties = new UploadedFilePropertiesModel { AMSObjectValetId = Guid.NewGuid() };
            var expectedFileDalModel = new UploadedFileDalModel
            {
                EpisodeId = fileToUpload.EpisodeId,
                AMSObjectValetId = uploadedFileProperties.AMSObjectValetId,
                AttachmentName = fileToUpload.Filename,
                DocumentType = fileToUpload.DocumentType
            };

            _fileHandlerMock.Setup(f => f.PostToOVEndpoint(fileToUpload)).Returns(uploadedFileProperties);

            // Act
            var result = _attachmentManagement.PostToOVEndpoint(fileToUpload);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(uploadedFileProperties.AMSObjectValetId, result.AMSObjectValetId);
            _attachmentDetailsMock.Verify(a => a.AddAttachmentDetails(It.Is<UploadedFileDalModel>(f =>
                f.EpisodeId == expectedFileDalModel.EpisodeId &&
                f.AMSObjectValetId == expectedFileDalModel.AMSObjectValetId &&
                f.AttachmentName == expectedFileDalModel.AttachmentName &&
                f.DocumentType == expectedFileDalModel.DocumentType
            )), Times.Once);
        }
    }
}
