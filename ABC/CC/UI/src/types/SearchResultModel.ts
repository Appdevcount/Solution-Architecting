interface SearchResultModel {
  CareCoordinationEpisodeId: string;
  CareCoordinationEpisodeDate: string;
  CaseStatus: string;
  HealthPlan: string;
  CompanyId: number;
  Reason: string;
  DateOfService: string;
  DateOfClosing: string;
  IsEscalated: boolean;
  CreatedBy: string;
  CreateDate: string;
  PatientID: string;
  PatientName: string;
  PatientDOB: string;
  Program: string;
  IsRestrictedMember: boolean;
}
export interface SearchHistoricalResultModel {
  ccRequestID: string;
  ccCaseStatus: string;
  ccReason: string;
  caseManagerName: string;
  socDate: string;
  member: Member;
  procedure: Procedure[];
  servicingProvider: ServicingProvider;
}

export interface Member {
  memberID: string;
  memberPolicy: MemberPolicy;
}

export interface MemberPolicy {
  insurer: string;
  program: string;
}

export interface Procedure {
  procedureCode: string;
  procedureCodeDescription: string;
}

export interface ServicingProvider {
  physicianName: string;
}

export default SearchResultModel;
