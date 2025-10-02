using CareCoordination.Application.Abstracts.DALInterfaces;
using CareCoordination.Application.Abstracts.ServiceInterfaces;
using CareCoordination.Application.Handlers;
using CareCoordination.Domain.Entities;
using CareCoordination.Services.Implementation;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace CareCoordination.Tests.Services
{
    public class UserServiceTest
    {
        private readonly Mock<IUserRepository> _userRepository;
        private readonly UserService _userService;

        public UserServiceTest()
        {
            _userRepository = new Mock<IUserRepository>();
            _userService = new UserService(_userRepository.Object);
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
            _userRepository.Setup(tm => tm.GetUserDetails(It.IsAny<string>())).Returns(user);
            var result = _userService.ValidateUser(userName);

            //Assert
            Assert.Equal(userName,result.Username);
        }
    }
}
