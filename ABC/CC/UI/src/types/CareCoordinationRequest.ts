export interface CareCoordinationRequest {
    episodeId: string | null;
    companyId: number;
    notes: string | null;
    dateOfService: string | null;
    isEscalated: boolean;
    requestor: Requestor | null;
    patientDetails: PatientDetails | null;
    staffedRequest: boolean | null;
    subServiceType: string | null;
}

export interface Requestor {
    lastName: string | null;
    phoneNumber: string | null;
    extension: string | null;
    fax: string | null;
    email: string | null;
    facility: string | null;
}

export interface PatientDetails {
    addr1: string | null;
    addr2: string | null;
    city: string | null;
    state: string | null;
    zip: string | null;
    sex: string | null;
    phone: string | null;
    dOB: string;
    oAOSubNo: string | null;
    oAOPerNo: string | null;
    oAOEmpNo: string | null;
    memberCode: string | null;
    groupNumber: string | null;
    planType: string | null;
    lineOfBusiness: string | null;
    language: string | null;
    patientPlanType: string | null;
    entity: string | null;
    category: string | null;
    iPA: string | null;
    ident: number;
    email: string | null;
    cellPhone: string | null;
    jurisdictionState: string | null;
    tIT19: string | null;
    caseFactor: number;
    pUSRDF: string | null;
    fundType: string | null;
    eRISA: string | null;
    eXTID: string | null;
    memberStartDate: string | null;
    isQuickCreate: boolean;
}