using CareCoordination.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Text.RegularExpressions;
using System.Diagnostics.CodeAnalysis;

namespace CareCoordination.Domain.Validators
{
    [ExcludeFromCodeCoverage]
    public static class CaseManagmentValidation
    {
        public static string ValidateMSOCRequest(CaseManagementEntity request)
        {
            string error = string.Empty;
            if(string.IsNullOrEmpty(request.RequestType))
            {
                error = "RequestType is mandatory while updating Date of Service or Missed Start Of Care";
                return error;
            }
            if (request.RequestType == "MSOC")
            {
                if (string.IsNullOrEmpty(request.RequestId))
                {
                    error = "Request ID cannot be empty";
                    return error;
                }
                else if (request.MissedStartOfCare == null)
                {
                    error = "Missed start of care cannot be empty";
                    return error;
                }
                else if (request.MissedStartOfCare == true && string.IsNullOrEmpty(request.MissedStartOfCareReason))
                {
                    error = "Missed start of care reason cannot be empty";
                    return error;
                }
            }
            return error;
        }
        [ExcludeFromCodeCoverage]
        public static string ValidateEscalateRequest(CaseManagementEntity request)
        {
            string error = string.Empty;
            if (string.IsNullOrEmpty(request.RequestId))
            {
                error = "Request ID cannot be empty";
                return error;
            }
            else if (request.IsEscalated == null)
            {
                error = "Escalate cannot be empty";
                return error;
            }
            return error;
        }
        [ExcludeFromCodeCoverage]
        public static string ValidateCaseStatusRequest(CaseManagementEntity request)
        {
            string error = string.Empty;
            if (string.IsNullOrEmpty(request.RequestId))
            {
                error = "Request ID cannot be empty";
                return error;
            }
            else if (string.IsNullOrEmpty(request.CaseStatus))
            {
                error = "Case Status cannot be empty";
                return error;
            }
            else if(string.IsNullOrEmpty(request.CloseReason))
            {
                error = "Close Reason cannot be empty";
                return error;
            }
            return error;
        }
        [ExcludeFromCodeCoverage]
        public static string ValidateFollowUPDate(CaseManagementEntity request)
        {
            string error = string.Empty;
            if (string.IsNullOrEmpty(request.RequestId))
            {
                error = "Request ID cannot be empty";
                return error;
            }
            if (!request.FollowUPDate.HasValue) 
            {
                error = "Follow-Up date cannot be empty";
                return error;
            }
            DateTime currentDate = DateTime.UtcNow;
            DateTime maxAllowedDate = currentDate.AddDays(45);
            if (request.FollowUPDate.Value > maxAllowedDate)
            {
                error = "Follow-up date cannot be more than 45 days from today";
                return error;
            }
            if(string.IsNullOrEmpty(request.FollowUPNote))
            {
                error = "Follow-up Note cannot be empty";
                return error;
            }
            return error;
        }
        [ExcludeFromCodeCoverage]
        public static string ValidateAddedNotes(CaseManagementEntity request)
        {
            string error = string.Empty;
            if (string.IsNullOrEmpty(request.RequestId))
            {
                error = "Request ID cannot be empty";
                return error;
            }
            if (string.IsNullOrEmpty(request.Notes))
            {
                error = "Note cannot be empty";
                return error;
            }            
            return error;
        }
        [ExcludeFromCodeCoverage]
        public static string ValidateCaseManager(CaseManagementEntity request)
        {
            string error = string.Empty;
            if (string.IsNullOrEmpty(request.RequestId))
            {
                error = "Request ID cannot be empty";
                return error;
            }
            if (string.IsNullOrEmpty(request.FirstName))
            {
                error = "First Name cannot be empty";
                return error;
            }
            if (string.IsNullOrEmpty(request.LastName))
            {
                error = "Last Name cannot be empty";
                return error;
            }
            if (string.IsNullOrEmpty(request.Email))
            {
                error = "Email cannot be empty";
                return error;
            }
            if (string.IsNullOrEmpty(request.PhoneNumber))
            {
                error = "Phone Number cannot be empty";
                return error;
            }
            if (string.IsNullOrEmpty(request.Extension))
            {
                error = "Extension cannot be empty";
                return error;
            }
            return error;
        }
        [ExcludeFromCodeCoverage]
        public static string ValidateActivityDetails(string careCoordinationEpisodeId)
        {
            string error = string.Empty;
            if (string.IsNullOrEmpty(careCoordinationEpisodeId))
            {
                error = "Episode ID cannot be empty";
                return error;
            }
            return error;
        }
    }
}
