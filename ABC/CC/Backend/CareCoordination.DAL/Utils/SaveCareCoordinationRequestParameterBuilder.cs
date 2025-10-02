using Azure.Core;
using CareCoordination.Application.Models;
using CareCoordination.Domain.Models;
using Dapper;
using System;
using System.Collections.Generic;
using System.Data;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CareCoordination.DAL.Utils
{
    [ExcludeFromCodeCoverage]
    public static class SaveCareCoordinationRequestParameterBuilder
    {
        public static DynamicParameters BuildSaveCareCordinationRequestParameters(CareCoordinationRequestModel request)
        {
            var parameters = new DynamicParameters();
            AddParameter(parameters, "@EpisodeId", request?.EpisodeId, DbType.String);
            AddRequestorParameters(parameters, request?.Requestor);
            AddParameter(parameters, "@CompanyId", request?.CompanyId, DbType.Int32);
            AddParameter(parameters, "@HealthPlan", request?.HealthPlan?.ToUpper(), DbType.String);
            AddParameter(parameters, "@Reason", request?.Reason, DbType.String);
            AddParameter(parameters, "@Notes", request?.Notes, DbType.String);
            AddParameter(parameters, "@DateOfService", request?.DateOfService, DbType.DateTime);
            AddParameter(parameters, "@IsEscalated", request?.IsEscalated, DbType.Boolean);
            AddPatientDetailsParameters(parameters, request?.PatientDetails);
            AddParameter(parameters, "@StaffedRequest", request?.StaffedRequest, DbType.Boolean);
            AddParameter(parameters, "@SubServiceType", request?.SubServiceType, DbType.String);
            return parameters;
        }

        private static void AddParameter(DynamicParameters parameters, string name, object? value, DbType dbType)
        {
            if (value is string str && string.IsNullOrEmpty(str))
            {
                parameters.Add(name, DBNull.Value, dbType);
            }
            else
            {
                parameters.Add(name, value ?? DBNull.Value, dbType);
            }
        }

        private static void AddRequestorParameters(DynamicParameters parameters, CareCoordination.Application.Models.Requestor? requestor)
        {
            AddParameter(parameters, "@RequestorFirstName", requestor?.FirstName, DbType.String);
            AddParameter(parameters, "@RequestorLastName", requestor?.LastName, DbType.String);
            AddParameter(parameters, "@RequestorPhoneNumber", requestor?.PhoneNumber, DbType.String);
            AddParameter(parameters, "@RequestorExtension", requestor?.Extension, DbType.String);
            AddParameter(parameters, "@RequestorFax", requestor?.Fax, DbType.String);
            AddParameter(parameters, "@RequestorEmail", requestor?.Email, DbType.String);
            AddParameter(parameters, "@RequestorFacility", requestor?.Facility, DbType.String);
        }

        private static void AddPatientDetailsParameters(DynamicParameters parameters, CareCoordination.Application.Models.PatientDetail? patientDetails)
        {
            AddParameter(parameters, "@PatientID", patientDetails?.ID, DbType.String);
            AddParameter(parameters, "@PatientName", patientDetails?.Name, DbType.String);
            AddParameter(parameters, "@PatientAddr1", patientDetails?.Addr1, DbType.String);
            AddParameter(parameters, "@PatientAddr2", patientDetails?.Addr2, DbType.String);
            AddParameter(parameters, "@PatientCity", patientDetails?.City, DbType.String);
            AddParameter(parameters, "@PatientState", patientDetails?.State, DbType.String);
            AddParameter(parameters, "@PatientZip", patientDetails?.Zip, DbType.String);
            AddParameter(parameters, "@PatientSex", patientDetails?.Sex, DbType.String);
            AddParameter(parameters, "@PatientPhone", patientDetails?.Phone, DbType.String);
            AddParameter(parameters, "@PatientDOB", patientDetails?.DOB, DbType.DateTime);
            AddParameter(parameters, "@OAOSubNo", patientDetails?.OAOSubNo, DbType.String);
            AddParameter(parameters, "@OAOPerNo", patientDetails?.OAOPerNo, DbType.String);
            AddParameter(parameters, "@OAOEmpNo", patientDetails?.OAOEmpNo, DbType.String);
            AddParameter(parameters, "@PatientMemberCode", patientDetails?.MemberCode, DbType.String);
            AddParameter(parameters, "@GroupNumber", patientDetails?.GroupNumber, DbType.String);
            AddParameter(parameters, "@PlanType", patientDetails?.PlanType, DbType.String);
            AddParameter(parameters, "@LineOfBusiness", patientDetails?.LineOfBusiness, DbType.String);
            AddParameter(parameters, "@Language", patientDetails?.Language, DbType.String);
            AddParameter(parameters, "@PatientPlanType", patientDetails?.PatientPlanType, DbType.String);
            AddParameter(parameters, "@PatientEntity", patientDetails?.Entity, DbType.String);
            AddParameter(parameters, "@Category", patientDetails?.Category, DbType.String);
            AddParameter(parameters, "@PatientIPA", patientDetails?.IPA, DbType.String);
            AddParameter(parameters, "@PatientIdent", patientDetails?.Ident, DbType.Int64);
            AddParameter(parameters, "@Email", patientDetails?.Email, DbType.String);
            AddParameter(parameters, "@CellPhone", patientDetails?.CellPhone, DbType.String);
            AddParameter(parameters, "@JurisdictionState", patientDetails?.JurisdictionState, DbType.String);
            AddParameter(parameters, "@TIT19", patientDetails?.TIT19, DbType.String);
            AddParameter(parameters, "@CaseFactor", patientDetails?.CaseFactor, DbType.Int16);
            AddParameter(parameters, "@PatientPUSRDF", patientDetails?.PUSRDF, DbType.String);
            AddParameter(parameters, "@FundType", patientDetails?.FundType, DbType.String);
            AddParameter(parameters, "@ERISA", patientDetails?.ERISA, DbType.String);
            AddParameter(parameters, "@EXTID", patientDetails?.EXTID, DbType.String);
            if(!patientDetails.IsQuickCreate)
            {
                AddParameter(parameters,"@MemberStartDate",patientDetails?.MemberStartDate, DbType.DateTime);
            }
            AddParameter(parameters, "@IsQuickCreate", patientDetails?.IsQuickCreate, DbType.Boolean);
            AddParameter(parameters, "@IsRestrictedMember", patientDetails?.IsRestrictedMember, DbType.Boolean);
        }
        public static DynamicParameters BuildUpdateCaseManagerParameters(CaseManagementModel request)
        {
            var parameters = new DynamicParameters();
            AddParameter(parameters, "@RequestId", request?.RequestId, DbType.String);
            AddParameter(parameters, "@FirstName", request?.FirstName, DbType.String);
            AddParameter(parameters, "@LastName", request?.LastName, DbType.String);
            AddParameter(parameters, "@PhoneNumber", request?.PhoneNumber, DbType.String);
            AddParameter(parameters, "@Extension", request?.Extension, DbType.String);
            AddParameter(parameters, "@Email", request?.Email, DbType.String);
            AddParameter(parameters, "@UserId", request?.UserId, DbType.String);
            return parameters;
        }
        public static DynamicParameters BuildGetActivityParameters(string careCoordinationEpisodeId)
        {
            var parameters = new DynamicParameters();
            AddParameter(parameters, "@careCoordinationEpisodeId", careCoordinationEpisodeId, DbType.String);
            return parameters;
        }
        public static DynamicParameters BuildAddNotesParameters(CaseManagementModel request)
        {
            var parameters = new DynamicParameters();
            AddParameter(parameters, "@RequestId", request?.RequestId, DbType.String);
            AddParameter(parameters, "@Note", request?.Notes, DbType.String);
            AddParameter(parameters, "@UserId", request?.UserId, DbType.String);
            return parameters;
        }
        public static DynamicParameters BuildFollowUpDateParameters(CaseManagementModel request)
        {
            var parameters = new DynamicParameters();
            AddParameter(parameters, "@RequestId", request?.RequestId, DbType.String);
            AddParameter(parameters, "@FollowUPDate", request?.FollowUPDate, DbType.DateTime);
            AddParameter(parameters, "@FollowUPNote", request?.FollowUPNote, DbType.String);
            AddParameter(parameters, "@UserId", request?.UserId, DbType.String);
            return parameters;
        }
        public static DynamicParameters BuildIsEscalateRequestParameters(CaseManagementModel request)
        {
            var parameters = new DynamicParameters();
            AddParameter(parameters, "@RequestId", request?.RequestId, DbType.String);
            AddParameter(parameters, "@IsEscalate", request?.IsEscalated, DbType.Boolean);
            AddParameter(parameters, "@UserId", request?.UserId, DbType.String);
            return parameters;
        }
        public static DynamicParameters BuildUpdateCaseStatusParameters(CaseManagementModel request)
        {
            var parameters = new DynamicParameters();
            AddParameter(parameters, "@RequestId", request?.RequestId, DbType.String);
            AddParameter(parameters, "@CaseStatus", request?.CaseStatus, DbType.String);
            AddParameter(parameters, "@CloseReason", request?.CloseReason, DbType.String);
            AddParameter(parameters, "@UserId", request?.UserId, DbType.String);
            return parameters;
        }
        public static DynamicParameters BuildMissedStartOfCareParameters(CaseManagementModel request)
        {
            var parameters = new DynamicParameters();
            AddParameter(parameters, "@RequestId", request?.RequestId, DbType.String);
            AddParameter(parameters, "@MissedStartOfCare", request?.MissedStartOfCare, DbType.Boolean);
            AddParameter(parameters, "@MissedStartOfCareReason", request?.MissedStartOfCareReason, DbType.String);
            AddParameter(parameters, "@UserId", request?.UserId, DbType.String);
            return parameters;
        }
    }
}
