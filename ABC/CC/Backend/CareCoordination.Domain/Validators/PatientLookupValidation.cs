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
    public static class PatientLookupValidation
    {
        public static string ValidateRequest(string? PatientID, string? PatientLastName, string? PatientDob, string? PatientFirstName)
        {
            string error = string.Empty;
            string specialCharPattern = @"[^a-zA-Z\s]";
            if (string.IsNullOrEmpty(PatientID))
            {
                error = "Patient ID cannot be empty";
                return error;
            }
            else if (string.IsNullOrEmpty(PatientLastName))
            {
                error = "Patient Last Name is mandatory";
                return error;
            }
            else if (string.IsNullOrEmpty(PatientDob))
            {
                error = "Patient Date of Birth cannot be empty";
                return error;
            }
            else if (!string.IsNullOrEmpty(PatientFirstName) && Regex.IsMatch(PatientFirstName, specialCharPattern))
            {
                error = "Patient First name cannot contain special characters or numbers";
                return error;
            }
            else if (Regex.IsMatch(PatientLastName, specialCharPattern))
            {
                error = "Patient last name cannot contain special characters or numbers";
                return error;
            }
            return error;

        }
    } }
