using CareCoordination.Domain.Models;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace CareCoordination.Domain.Validators
{
    [ExcludeFromCodeCoverage]
    public static class MemberQuickCreateValidation
    {
        public static string ValidateRequest(CareCoordinationDomainModel request)
        {
            string error = string.Empty;
            string specialCharPattern = @"[^a-zA-Z0-9\s]+$";
            string namePattern = @"^[a-zA-Z\s\W]+$";
            string numeric = @"^(?:\d{5}|\d{9})$";
            if (string.IsNullOrEmpty(request?.PatientDetails?.ID) || (request?.PatientDetails?.ID != null && Regex.IsMatch(request.PatientDetails.ID, specialCharPattern, RegexOptions.None, TimeSpan.FromMilliseconds(500))) || (request?.PatientDetails?.ID != null && request?.PatientDetails?.ID.Length < 9))
            {
                error = "Patient ID cannot contain special characters & length should be atleast 9 characters.";
                return error;
            }
            else if (string.IsNullOrEmpty(request?.PatientDetails?.Name) || (request?.PatientDetails?.Name != null && !Regex.IsMatch(request.PatientDetails.Name, namePattern, RegexOptions.None, TimeSpan.FromMilliseconds(500))))
            {
                error = "Patient Name is mandatory and should not allow numbers.";
                return error;
            }
            else if (request?.PatientDetails?.DOB == null)
            {
                error = "Patient Date of Birth is mandatory";
                return error;
            }
            else if (string.IsNullOrEmpty(request.PatientDetails.Addr1))
            {
                error = "Patient Address is mandatory";
                return error;
            }
            else if (string.IsNullOrEmpty(request.PatientDetails.State))
            {
                error = "Patient State is mandatory";
                return error;
            }
            else if (string.IsNullOrEmpty(request.PatientDetails.City))
            {
                error = "Patient City is mandatory";
                return error;
            }
            else if (string.IsNullOrEmpty(request.PatientDetails.Zip) || !Regex.IsMatch(request.PatientDetails.Zip, numeric, RegexOptions.None, TimeSpan.FromMilliseconds(500)))
            {
                error = "Patient Zip is mandatory, only numbers are allowed and should be 5 or 9 chars.";
                return error;
            }
            return error;

        }
    }
}
