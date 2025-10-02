using AutoMapper;
using Azure;
using Azure.Core;
using CareCoordination.Api.DTOs;
using CareCoordination.Application.Abstracts.HandlerInterfaces;
using CareCoordination.Application.Logger;
using CareCoordination.Application.Models;
using CareCoordination.Domain.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace CareCoordination.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        private readonly IApplicationLogger _logger;
        private readonly IMapper _mapper;
        private readonly IDashboardViewManagement _dashboardViewManagement;
        public DashboardController(IApplicationLogger logger, IMapper mapper, IDashboardViewManagement dashboardViewManagement)
        {
            _logger = logger;
            _mapper = mapper;
            _dashboardViewManagement = dashboardViewManagement ?? throw new ArgumentNullException(nameof(dashboardViewManagement));
        }
        [Authorize]
        [HttpPost("DashboardCaseAssignment")]
        public async Task<IActionResult> DashboardCaseAssignment(DashboardCaseAssignmentRequest request)
        {
            DashboardCaseAssignmentResponseModel response = new DashboardCaseAssignmentResponseModel();
            try
            {
                _logger.LogInformation($"{typeof(DashboardController).Name}: DashboardCaseAssignment Started.");
                if(request == null)
                {
                    _logger.LogError($"{typeof(DashboardController).Name}: DashboardCaseAssignment Bad Request.");
                    return BadRequest(response);
                }
                else
                {
                    _logger.LogInformation($"{typeof(DashboardController).Name}: DashboardCaseAssignment Internal Method Started for Assignee Name - {request.AssigneeName}.");

                    DashboardCaseAssignmentRequestModel model = _mapper.Map<DashboardCaseAssignmentRequestModel>(request);
                    response = await _dashboardViewManagement.DashboardCaseAssignment(model);
                    
                    _logger.LogInformation($"{typeof(DashboardController).Name}: DashboardCaseAssignment Internal Method Ended for Assignee Name - {request.AssigneeName}.");
                }
            }
            catch (Exception ex)
            {
                _logger.LogException($"{typeof(DashboardController).Name}: DashboardCaseAssignment Error for Assignee Name - {request.AssigneeName}.",ex);
                return StatusCode((int)HttpStatusCode.InternalServerError,ex.Message);
                throw;
            }
            _logger.LogInformation($"{typeof(DashboardController).Name}: DashboardCaseAssignment Ended for Assignee Name - {request.AssigneeName}.");
            return Ok(response);

        }
        [Authorize]
        [HttpPost("GetDashboardDetails")]
        public async Task<IActionResult> GetDashboardDetails(DashboardLoadRequest? request)
        {
            DashboardLoadResponseModel response = new DashboardLoadResponseModel();
            try
            {
                _logger.LogInformation($"{typeof(DashboardController).Name}: GetDashboardDetails Started.");

                if(request == null )
                {
                    _logger.LogError($"{typeof(DashboardController).Name}: GetDashboardDetails Bad Request.");
                    return BadRequest(response);
                }
                else
                {
                    _logger.LogInformation($"{typeof(DashboardController).Name}: GetDashboardDetails Internal Method Started for User - {request.UserName}.");

                    DashboardLoadRequestModel model = _mapper.Map<DashboardLoadRequestModel>(request);
                    response = await _dashboardViewManagement.GetDashboardDetails(model);

                    _logger.LogInformation($"{typeof(DashboardController).Name}: GetDashboardDetails Internal Method Ended for User - {request.UserName}.");
                }

            }
            catch (Exception ex)
            {
                _logger.LogException($"{typeof(DashboardController).Name}: GetDashboardDetails Error.",ex);
                return StatusCode((int)HttpStatusCode.InternalServerError,ex.Message);
                throw;
            }
            _logger.LogInformation($"{typeof(DashboardController).Name}: GetDashboardDetails Ended for User - {request.UserName}.");
            return Ok(response);

        }

        [Authorize]
        [HttpGet("GetAssigneeDetails")]
        public async Task<IActionResult> GetAssigneeDetails(string userName)
        {
            AssigneeDetailsResponse response = new AssigneeDetailsResponse();
            try
            {
                _logger.LogInformation($"{typeof(DashboardController).Name}: GetAssigneeDetails Started.");
                if(userName == null)
                {
                    _logger.LogError($"{typeof(DashboardController).Name}: GetAssigneeDetails Bad Request.");
                    return BadRequest(response);
                }
                else
                {
                    _logger.LogInformation($"{typeof(DashboardController).Name}: GetAssigneeDetails Internal Method Started for User - {userName}.");

                    response = await _dashboardViewManagement.GetAssigneeDetails(userName);

                    _logger.LogInformation($"{typeof(DashboardController).Name}: GetAssigneeDetails Internal Method Ended for User - {userName}.");
                }
            }
            catch(Exception ex)
            {
                _logger.LogException($"{typeof(DashboardController).Name}: GetAssigneeDetails Error for User - {userName}.",ex);
                return StatusCode((int)HttpStatusCode.InternalServerError,ex.Message);
                throw;
            }
            _logger.LogInformation($"{typeof(DashboardController).Name}: GetAssigneeDetails Ended for User - {userName}.");
            return Ok(response);
        }
    }
}
