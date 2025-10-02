using CareCoordination.Application.Abstracts.DALInterfaces;
using CareCoordination.Application.Models;
using CareCoordination.DAL.Implementation;
using Dapper;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Logging;
using Moq;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace CareCoordination.Tests.DalServices
{
    public class AttachmentDetailsTest
    {
        private readonly Mock<IDbService> _dbServiceMock;
        private readonly AttachmentDetails _attachmentDetails;

        public AttachmentDetailsTest()
        {
            _dbServiceMock = new Mock<IDbService>();
            _attachmentDetails = new AttachmentDetails(_dbServiceMock.Object);
        }

        [Fact]
        public void AddAttachmentDetails_Should_Execute_StoredProcedure_When_Valid_Model()
        {
            // Arrange
            var fileDalModel = new UploadedFileDalModel
            {
                EpisodeId = "EP123",
                AMSObjectValetId = Guid.NewGuid(),
                DocumentType = "TypeA",
                AttachmentName = "Attachment1",
                UserId= "test-user"
            };

            _dbServiceMock.Setup(d => d.ExecuteAsync(It.IsAny<string>(), It.IsAny<object>(), It.IsAny<CommandType>(),null,null))
                .ReturnsAsync(1);

            // Act
            var exception = Record.Exception(() => _attachmentDetails.AddAttachmentDetails(fileDalModel));

            // Assert
            Assert.Null(exception);
            _dbServiceMock.Verify(d => d.ExecuteAsync("CC_AddAttachmentDetails", It.IsAny<DynamicParameters>(), CommandType.StoredProcedure,null,null), Times.Once);
        }

        [Fact]
        public void AddAttachmentDetails_Should_LogError_When_Exception_Occurs()
        {
            // Arrange
            var fileDalModel = new UploadedFileDalModel
            {
                EpisodeId = "EP123",
                AMSObjectValetId = Guid.NewGuid(),
                DocumentType = "TypeA",
                AttachmentName = "Attachment1",
                UserId = "test-user"
            };

            _dbServiceMock.Setup(d => d.ExecuteAsync(It.IsAny<string>(), It.IsAny<object>(), It.IsAny<CommandType>(), null, null))
                .Throws(new Exception("Database error"));

            // Act
            var exception = Record.Exception(() => _attachmentDetails.AddAttachmentDetails(fileDalModel));

            // Assert
            Assert.NotNull(exception);
            
        }

        [Fact]
        public void AddAttachmentDetails_Should_Handle_Null_Or_Empty_Properties()
        {
            // Arrange
            var fileDalModel = new UploadedFileDalModel
            {
                EpisodeId = null,
                AMSObjectValetId = Guid.Empty,
                DocumentType = null,
                AttachmentName = null,
                UserId = null
            };

            _dbServiceMock.Setup(d => d.ExecuteAsync(It.IsAny<string>(), It.IsAny<object>(), It.IsAny<CommandType>(), null, null))
                .ReturnsAsync(1);

            // Act
            var exception = Record.Exception(() => _attachmentDetails.AddAttachmentDetails(fileDalModel));

            // Assert
            Assert.Null(exception);
            _dbServiceMock.Verify(d => d.ExecuteAsync("CC_AddAttachmentDetails", It.IsAny<DynamicParameters>(), CommandType.StoredProcedure, null, null), Times.Once);
        }
        [Fact]
        public async Task DeleteAttachmentDetails_ReturnTrue_WhenExecutionIsSuccessful()
        {
            //arrange
            var request = new DeleteFilePropertiesViewModel
            {
                ObjectId = 12345,
                EpisodeId = "1234679"
            };
            _dbServiceMock.Setup(m=>m.ExecuteAsync(It.IsAny<string>(),It.IsAny<object>(),It.IsAny<CommandType>(),null,null))
                .ReturnsAsync(1);

            var result = await _attachmentDetails.DeleteAttachmentDetails(request);

            Assert.True(result);
        }
        [Fact]
        public async Task DeleteAttachmentDetails_ReturnFalse_WhenExecutionReturnZero()
        {
            //arrange
            var request = new DeleteFilePropertiesViewModel
            {
                ObjectId = 12345,
                EpisodeId = "1234679"
            };
            _dbServiceMock.Setup(m => m.ExecuteAsync(It.IsAny<string>(),It.IsAny<object>(),It.IsAny<CommandType>(),null,null))
               .ReturnsAsync(0);

            var result = await _attachmentDetails.DeleteAttachmentDetails(request);

            Assert.False(result);
        }
        [Fact]
        public async Task DeleteAttachmentDetails_ReturnFalse_WhenSQLExceptionThrown()
        {
            //arrange
            var request = new DeleteFilePropertiesViewModel
            {
                ObjectId = 12345,
                EpisodeId = "1234679"
            };
            _dbServiceMock.Setup(m => m.ExecuteAsync(It.IsAny<string>(),It.IsAny<object>(),It.IsAny<CommandType>(),null,null))
                .ThrowsAsync(new Exception());

            var res = await _attachmentDetails.DeleteAttachmentDetails(request);
            Assert.False(res);

        }
    }
}
