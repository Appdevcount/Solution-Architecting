/* istanbul ignore file */
export class PatientDetailsResponse {
    apiResult: ActivityResponse[] | null =null;
    apiError: string | null = "";
    isSuccess: boolean = false;
    language: string | null = "";
    erisa: string | null = "";
    fundingType: string | null = "";
}
export class ResponseActivityResponseModel {
    apiResult: ActivityResponse[] = []
    apiError: string = ""
}

export interface ActivityResponse {
    patientID: string;
    lastName: string | null;
    firstName: string | null;
    patientName: string | null;
    patientAddr1: string | null;
    patientAddr2: string | null;
    patientCity: string | null;
    patientState: string | null;
    patientZip: string | null;
    patientGender: string | null;
    patientPhone: string | null;
    patientDOB: string;
    patientEffDate: string;
    patientTermDate: string;
    patientGroupNumber: string | null;
    patientGroupDescription: string | null;
    oAOSubNo: string | null;
    oAOPerNo: string | null;
    entity: string | null;
    planCode: string | null;
    planType: string | null;
    jurisdictionState: string | null;
    lineOfBusiness: string | null;
    iPACode: string | null;
    patientPUSRDF: string | null;
    patientPlanNetworkIndicator: string | null;
    extID: string | null;
    patientORGCD: string | null;
    cellPhone: string | null;
    defaultPlanCode: string | null;
    memberCode: string | null;
    ssnum: string | null;
    cPECFL: string | null;
    cPECFD: string | null;
    cPBPID: string | null;
    tIT19: string | null;
    eMAIL: string | null;
    category: string;
    cPEFDT: string | null;
    isRestrictedMember: boolean;
}

export class EligibilityDetailsResponse {
    apiResult: EligibilityResponse[] | null =null;
    apiError: string | null = "";
}
export interface EligibilityAPIResponse {
    caseBuild: string | null;
    companyID: string | null;
    cplntp: string | null;
    cptCode: string | null;
    dos: string | null;
    insCarrier: string | null;
    memberInScope: string | null;
    planTypeEligible: string | null;
  }

  export interface EligibilityResponse {
    caseBuild: string | null;
    companyID: string | null;
    cplntp: string | null;
    cptCode: string | null;
    dos: string | null;
    insCarrier: string | null;
    memberInScope: string | null;
    planTypeEligible: string | null;
  }

export interface SearchRequestAPIResponse{
    data:{
        patientID: string | null;
        lastName: string | null;
        firstName: string | null;
        patientName: string | null;
        patientAddr1: string | null;
        patientAddr2: string | null;
        patientCity: string | null;
        patientState: string | null;
        patientZip: string | null;
        patientGender: string | null;
        patientPhone: string | null;
        patientDOB: Date | null;
        patientEffDate: Date | null;
        patientTermDate: Date | null;
        patientGroupNumber: string | null;
        patientGroupDescription: string | null;
        oAOSubNo: string | null;
        oAOPerNo: string | null;
        entity: string | null;
        planCode: string | null;
        planType: string | null;
        jurisdictionState: string | null;
        lineOfBusiness: string | null;
        ipaCode: string | null;
        patientPUSRDF: string | null;
        patientPlanNetworkIndicator: string | null;
        extID: string | null;
        patientORGCD: string | null;
        cellPhone: string | null;
        defaultPlanCode: string | null;
        memberCode: string | null;
        ssnum: string | null;
        cPECFL: string | null;
        cPECFD: string | null;
        cPBPID: string | null;
        tIT19: string | null;
        eMAIL: string | null;
        category: string | null;
        cPEFDT: string | null;
        isRestrictedMember: boolean;
    }
};

export interface Patients {
    patientID: string | null;
    lastName: string | null;
    firstName: string | null;
    patientName: string | null;
    patientAddr1: string | null;
    patientAddr2: string | null;
    patientCity: string | null;
    patientState: string | null;
    patientZip: string | null;
    patientGender: string | null;
    patientPhone: string | null;
    patientDOB: string | null;
    patientEffDate: string | null;
    patientTermDate: string | null;
    patientGroupNumber: string | null;
    patientGroupDescription: string | null;
    oAOSubNo: string | null;
    oAOPerNo: string | null;
    entity: string | null;
    planCode: string | null;
    planType: string | null;
    jurisdictionState: string | null;
    lineOfBusiness: string | null;
    iPACode: string | null;
    patientPUSRDF: string | null;
    patientPlanNetworkIndicator: string | null;
    extID: string | null;
    patientORGCD: string | null;
    cellPhone: string | null;
    defaultPlanCode: string | null;
    memberCode: string | null;
    ssnum: string | null;
    cPECFL: string | null;
    cPECFD: string | null;
    cPBPID: string | null;
    tIT19: string | null;
    eMAIL: string | null;
    category: string | null;
    cPEFDT: string | null;
}

export interface PatientResponseRecord{
    patient: Patients;
    multipleDependents: string | null;
    subscriberLastName: string | null;
    subscriberFirstName: string | null;
    relationshipCode: string | null;
    aAAReturnCode: string | null;
    //benefits: Benefit[];
    message: string | null;
    validInfo: boolean;
    language: string | null;
    categoryNumber: string | null;
    secondaryId: string | null;
    erisa: string | null;
    companyId: string | null;
    healthPlan: string | null;
    externalMemberID: string | null;
    effective: string | null;
    indicator: string | null;
    oONBenefits: string | null;
    siteOfCareIndicator: string | null;
    policy: string | null;
    lookupType: string | null;
    assigningOrganization: string | null;
    fundingType: string | null;
    chemoIndicator: string | null;
    isLegacyID: string | null;
    providerPlanNetworkIndicator: string | null;
    groupInUnconfirmedTable: string | null;
    caseStatus: string | null;
    usesMemberCode: string | null;
    newInsCarrier: string | null;
    realCarrier: string | null;
    marketCode: string | null;
    productCode: string | null;
    retroIndicator: string | null;
    medNecIndicator: string | null;
    patientDDPIndicator: string | null;
    memberContract: string | null;
    manualAdd: string | null;
    validPatient: string | null;
    patientIDNoMemCode: string | null;
    primaryHealthPlanID: string | null;
    fraudFlag: string | null;
    secondaryHealthPlanID: string | null;
    phoneNumber: string | null;
    faxNumber: string | null;
    carrierID: number;
    defaultEntity: string | null;
    lenMemberCode: number;
    inactivePolicyMessage: string | null;
    patientPlanNumber: string | null;
    isHorizonHasOONBenefit: string | null;
    isHorizonHasITSBenefit: string | null;
    isCignaHasOONforChemo: string | null;
    isInscope: string | null;
    networkPatientID: string | null;
    mBI: string | null;
    hContract: string | null;
    pBP: string | null;
}