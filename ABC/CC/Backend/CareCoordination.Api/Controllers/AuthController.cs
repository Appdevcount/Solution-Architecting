using System.Net;
using System.Security.Claims;
using CareCoordination.Api.DTOs;
using CareCoordination.Domain.Entities;
using CareCoordination.Application.Abstracts.HandlerInterfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using CareCoordination.Application.Logger;

namespace CareCoordination.Api.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IApplicationLogger _logger;
        private readonly ITokenManagement _tokenManagement;
        private readonly IUserManagement _userManagement;
        private readonly IConfiguration _configuration;
        private readonly string ApiKeyHeaderName;
        private readonly string TokenHeaderName;

        public AuthController(IApplicationLogger logger, ITokenManagement tokenManagement,IUserManagement userManagement,IConfiguration configuration)
        {
            _logger = logger;
            _tokenManagement = tokenManagement;
            _userManagement = userManagement;
            _configuration = configuration;
            ApiKeyHeaderName = "X-API-Key";
            TokenHeaderName = "Authorization";
        }

        /// <summary>
        /// Generates an access token for valid users.
        /// </summary>
        [HttpPost("generate-token")]
        public IActionResult GenerateToken([FromBody] TokenRequest request)
        {
            try
            {
                _logger.LogInformation($"{typeof(AuthController).Name}: GenerateToken Started.");
                if(!Request.Headers.TryGetValue(ApiKeyHeaderName,out var extractedApiKey))
                {
                    _logger.LogError($"{typeof(AuthController).Name}: GenerateToken: API key is missing.");
                    return Unauthorized("API key is missing.");
                }

                if(request == null || string.IsNullOrEmpty(request.Username))
                {
                    _logger.LogError($"{typeof(AuthController).Name}: GenerateToken: Invalid request");
                    return BadRequest(new { message = "Invalid request" });
                }

                var apiKey = _configuration.GetValue<string>("ApiKey");

                if(!string.IsNullOrEmpty(apiKey) && !apiKey.Equals(extractedApiKey))
                {
                    _logger.LogError($"{typeof(AuthController).Name}: GenerateToken: Invalid Api Key");
                    return Unauthorized("Invalid Api Key");
                }

                _logger.LogInformation($"{typeof(AuthController).Name}: ValidateUser Started for User - {request.Username}.");
                var user = _userManagement.ValidateUser(request.Username);

                if(user == null)
                {
                    _logger.LogError($"{typeof(AuthController).Name}: ValidateUser: Invalid Username = {request.Username}");
                    return Unauthorized(new { message = "Invalid Username" });
                }
                _logger.LogInformation($"{typeof(AuthController).Name}: ValidateUser Ended.");

                _logger.LogInformation($"{typeof(AuthController).Name}: GenerateToken Internal Method Started for User - {request.Username}.");
                var tokenResponse = _tokenManagement.GenerateToken(request.Username);
                _logger.LogInformation($"{typeof(AuthController).Name}: GenerateToken Internal Method Ended for User - {request.Username}.");
                _logger.LogInformation($"{typeof(AuthController).Name}: GenerateToken Ended - Token - {tokenResponse}.");
                return Ok(tokenResponse);
            }
            catch(Exception ex)
            {
                _logger.LogException($"{typeof(AuthController).Name}: GenerateToken Error for User - {request.Username}.",ex);
                return StatusCode((int)HttpStatusCode.InternalServerError,ex.Message);
                throw;
            }
        }

        /// <summary>
        /// Validates an existing token.
        /// </summary>
        [Authorize]
        [HttpPost("validate-token")]
        public async Task<IActionResult> ValidateToken()
        {
            try
            {
                _logger.LogInformation($"{typeof(AuthController).Name}: ValidateToken Started.");
                var token = Request.Headers.Authorization.ToString().Split(" ").Last();

                _logger.LogInformation($"{typeof(AuthController).Name}: ValidateToken - Token - {token}");
                var tokenResponse = _tokenManagement.ValidateToken(token);

                _logger.LogInformation($"{typeof(AuthController).Name}: ValidateToken Ended - Refresh Token - {tokenResponse}");
                return Ok(tokenResponse);
            }
            catch(Exception ex)
            {
                _logger.LogException($"{typeof(AuthController).Name}: ValidateToken Error.",ex);
                return StatusCode((int)HttpStatusCode.InternalServerError,ex.Message);
                throw;
            }
        }

        /// <summary>
        /// Refreshes an expired token.
        /// </summary>
        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshTokens([FromBody] RefreshTokenRequest request)
        {
            try
            {
                _logger.LogInformation($"{typeof(AuthController).Name}: RefreshTokens Started.");
                if(request == null || string.IsNullOrEmpty(request.RefreshToken))
                {
                    _logger.LogError($"{typeof(AuthController).Name}: RefreshTokens: Invalid request");
                    return BadRequest(new { message = "Invalid request" });
                }

                _logger.LogInformation($"{typeof(AuthController).Name}: RefreshTokens: Internal Method Started for User - {request.UserName}.");
                var newToken = _tokenManagement.RefreshTokens(request.UserName,request.RefreshToken);

                if(newToken == null || newToken.AccessToken == null)
                {
                    _logger.LogError($"{typeof(AuthController).Name}: RefreshTokens: Invalid refresh token for User - {request.UserName}.");
                    return Unauthorized(new { message = "Invalid refresh token" });
                }
                _logger.LogInformation($"{typeof(AuthController).Name}: RefreshTokens Ended - Refresh Token - {newToken.RefreshToken} and Access Token = {newToken.AccessToken}.");
                return Ok(newToken);
            }
            catch(Exception ex)
            {
                _logger.LogException($"{typeof(AuthController).Name}: RefreshTokens Error for User - {request.UserName}.",ex);
                return StatusCode((int)HttpStatusCode.InternalServerError,ex.Message);
                throw;
            }
        }

        [HttpGet("GetUserDetails")]
        public IActionResult GetUserDetails()
        {
            User response = new User();
            string username = string.Empty;
            try
            {
                _logger.LogInformation($"{typeof(AuthController).Name}: GetUserDetails Started.");
                if (User?.Identity?.IsAuthenticated == true)
                {
                    username = User.FindFirstValue(ClaimTypes.NameIdentifier);
                }
                _logger.LogInformation($"{typeof(AuthController).Name}: GetUserDetails - ValidateUser Started for User - {username}.");
                response = _userManagement.ValidateUser(!string.IsNullOrEmpty(username) ? username : string.Empty);
                _logger.LogInformation($"{typeof(AuthController).Name}: GetUserDetails - ValidateUser Ended.");
            }
            catch (Exception ex)
            {
                _logger.LogException($"{typeof(AuthController).Name}: GetUserDetails Error.",ex);
                return StatusCode((int)HttpStatusCode.InternalServerError,ex.Message);
                throw;
            }
            _logger.LogInformation($"{typeof(AuthController).Name}: GetUserDetails Ended for User - {username}.");
            return Ok(response);
        }
    }
}
