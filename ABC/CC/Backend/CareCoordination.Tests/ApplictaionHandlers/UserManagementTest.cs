using CareCoordination.Application.Abstracts.ServiceInterfaces;
using CareCoordination.Application.Handlers;
using CareCoordination.Domain.Entities;
using Moq;
using Xunit;

namespace CareCoordination.Tests.ApplictaionHandlers
{
    public class UserManagementTest
    {
        private readonly Mock<IUserService> _userService;
        private readonly UserManagement _userManagement;

        public UserManagementTest()
        {
            _userService = new Mock<IUserService>();
            _userManagement = new UserManagement(_userService.Object);
        }

        [Fact]
        public void ValidateUser_Test()
        {
            //Arrange
            string userName = "bhushan.patil3";
            User user = new User()
            {
                UserId = "ASDF",
                Username = userName,
                Password = "qwsd",
                Role = "Nurse",
                HasLEA = false,
                Permissions = []
            };

            //Act
            _userService.Setup(tm => tm.ValidateUser(It.IsAny<string>())).Returns(user);
            var result = _userManagement.ValidateUser(userName);

            //Assert
            Assert.Equal(userName,result.Username);
        }
    }
}
