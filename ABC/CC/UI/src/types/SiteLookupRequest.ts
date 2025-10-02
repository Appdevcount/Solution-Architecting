export interface SiteLookupRequest extends RequestBase {
    caseSummaryDetail: CaseSummaryDetail;
    patientDetail: PatientDetail;
    physicianDetail: PhysicianDetail;
    site?: Site;
    lookupType: string;
}

export interface RequestBase {
    requestedBy: string;
}

export interface CaseSummaryDetail extends CaseSummary {
    cPTCode: string;
    cPTModality: string;
    priority: string;
    expLocSite: boolean;
    payor: string;
    caseProviderTypeID: number;
    retroSite: string;
    widgetCPTList: string;
    surgeonNPI: string;
}

export interface CaseSummary {
    carrier: string;
    planCode: string;
    companyId: string;
    isRetroCase: boolean;
}

export interface PatientDetail extends Patient {
    patientId: string;
    memberCode: string;
    dateOfBirth: string;
    state: string;
    patientPlanCode: string;
    sSNum: string;
    entity: string;
    iOQFacilities: string;
    tieredNetworkIndicator: string;
    sOCIndicator: string;
    sOCCase: string;
}

export interface Patient {
    jurisdictionState: string;
    memberIPACode: string;
    groupNumber: string;
    lineOfBusiness: string;
    pUSRDF: string;
    planType: string;
}

export interface PhysicianDetail extends Physician {
    oAOPhysicianId: string;
    zipCode: string;
    physicianDistance: string;
    physicianTin: string;
    physicianLastName: string;
    physicianFirstName: string;
    physicianNPI: string;
}

export interface Physician {
    state: string;
}

export interface Site {
    siteID: string;
    siteName: string;
    siteCity: string;
    nonPar: string;
    siteZip: string;
    siteSearchConstraint: string;
    contractSite: string;
    siteState: string;
    npi: string;
    siteAddress1: string;
    siteAddress2: string;
    allEntity: string;
    allIpaCode: string;
    cptPrivlegingSiteSearch: string;
    uspNetworkIds: string;
    distance: string;
    firstName: string;
    unetTciTableNumber: string;
    uspBenefitServiceArea: string;
    callType: string;
    siteLifetimeKey: string;
    networkIds: string;
}