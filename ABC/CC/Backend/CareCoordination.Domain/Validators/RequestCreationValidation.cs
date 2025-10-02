using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CareCoordination.Domain.Constants;
using CareCoordination.Domain.Models;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace CareCoordination.Domain.Validators
{
    [ExcludeFromCodeCoverage]
    public static class RequestCreationValidation
    {
        public static string ValidateRequest(CareCoordinationDomainModel request)
        {
            string error=string.Empty;
            if (request == null)
            {
                error = "Request cannot be null";
                return error;
            }
            else if (request?.PatientDetails?.IsQuickCreate == true)
            {
                error = MemberQuickCreateValidation.ValidateRequest(request);
            }
            else
            {
                if (string.IsNullOrEmpty(request?.Requestor?.FirstName))
                {
                    error = "Requestor First name cannot be empty";
                    return error;
                }
                if (string.IsNullOrEmpty(request.HealthPlan))
                {
                    error = "Health Plan cannot be empty";
                    return error;
                }
                if (request.CompanyId <= 0)
                {
                    error = "Company Id cannot be empty";
                    return error;
                }
                if (string.IsNullOrEmpty(request?.PatientDetails?.ID) || string.IsNullOrEmpty(request?.PatientDetails?.Name))
                {
                    error = "Patient ID/Name cannot be empty";
                    return error;
                }

                if (string.IsNullOrEmpty(request?.Reason))
                {
                    error = "Reason cannot be empty";
                    return error;
                }
                else if (request.Reason.Equals(ReasonConstants.MissedOrLateService) && string.IsNullOrEmpty(request.DateOfService.ToString()))
                {
                    error = "Date of Service is mandatory when reason is 'Missed/LateServices'";
                    return error;
                }
                else if ((request.Reason.Equals(ReasonConstants.HelpFindingServingProvider) || request.Reason.Equals(ReasonConstants.Other)) && string.IsNullOrEmpty(request.Notes))
                {
                    error = "Notes is mandatory when reason is 'Other' or 'Help finding a serving provider'";
                    return error;
                }
            }
            return error;
        }
    }
}
 