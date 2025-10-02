export interface SearchRequestAPIResponse{
    careCoordinationEpisodeId: string,
    careCoordinationEpisodeDate : string,
    caseStatus : string,
    healthPlan : string,
    companyId : number,
    program : string,
    subServiceType : string,
    reason : string,
    missedStartOfCare : boolean,
    assigneeName: string,
    dateOfService : string,
    dateOfClosing : string,
    isEscalated : boolean,
    createdBy : string,
    createDate : string,
    patientDetails : Patient,
    requester : RequestorInformation,
    caseManager : CaseManager,
    site : Site,
    followUp : FollowUp,
    notes : Notes [] | null,
    attachments: Attachment [] | null,
    cptCodes: ProcedureCode [] | null,
    activity: Activity [] | null,
    isRestrictedMember: boolean,
    staffedRequest : boolean,
    oon: string
};

export interface Patient{
    patientID:string,
    name: string,
    dateOfBirth:string,
    lob : string,
    groupNumber: string,
    planType: string,
    lineOfBusiness: string,
    language: string,
    patientPlanType: string,
    entity: string,
    category: string,
    ipa: string,
    patientIdent: string,
    email: null,
    cellPhone: string,
    jurisdictionState: string,
    memberQuickCreate: boolean,
    tiT19:string,
    calculated_PatientID_PatientMemberCode_GroupNumber: string,
    caseFactor:string,
    pusrdf: string  ,
    fundType: string,
    erisa: string,
    extid: string,
    startDate: string,
    patientSex: string,
    patientAddr1 : string,
    patientAddr2 : string,
    patientState : string,
    patientCity : string,
    patientZip : string
}

export interface RequestorInformation {
    firstName: string,
    lastName: string,
    contactNumber: string,
    contactExtension : string,
    facility: string,
    email: string
}

export interface CaseManager{
    firstName: string,
    lastName: string,
    phoneNumber: string,
    extention: string,
    email: string
}

export interface Site{
    name : string,
    npi : string,
    city: string,
    state: string,
    zip: string,
    addr1: string,
    addr2: string,
    oaoSiteID: string,
    nonParSiteID: string,
    oldSiteID: string,
	phone: string,
    fax: string,
    spec1: string,
    spec2: string,
    specDescription1: string,
    specDescription2: string,
    alternateID: string,
    nymiPar: string,
    steeragePosition: any,
    siteIdent: any,
    selectionMethodID: any,
    email: string,
    pusrdf: string,
    ipa: string,
    entity: string,
    siteType:string,
    PhysicianName:string,
}

export interface FollowUp{
    followUpDate: string,
    notes: string
}

export interface Notes{
    id : any,
    notes: string,     
    createdDate: string,
    createdBy: string
}
export interface Attachment{
    attachmentName: string;
}

export interface ProcedureCode{
    cptCode: string;
    simplifiedDescription: string;
}

export interface Activity {
    comments : string,
    createdBy : string
}

export interface SearchHistoricalAPIResponseModel {
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