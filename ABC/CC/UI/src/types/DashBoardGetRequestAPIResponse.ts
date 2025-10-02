export interface DashBoardGetRequestAPIReponse {
    dashboardDetails: DashBoardDetails [],
    dashboardCounts : DashBoardCounts,
    isSuccess : boolean,
    error : string,
    totalRecords: number, 
    isSupervisor : boolean

}

export interface DashBoardDetails{

    careCoordinationEpisodeID : string,
    patientName : string,
    patientDOB : string,
    createdDateTime : string,
    followupDate : string,
    patientID : string,
    escalationStatus : string,
    caseStatus : string,
    status : string,
    reason : string,
    patientCity : string,
    assigneeName : string,
    subServiceType : string,
    isRestrictedMember : boolean,
    totalRecords:any
}

export interface DashBoardCounts{
    
    casesOpen : string,
    isEscalated : string,
    isNotEscalated : string,
    missedStartOfCare : string,
    assigned : string,
    homeHealth : string,
    dme : string,
    sleep : string,
    onP : string,
    memberEscalation : string,
    missedServices : string,
    findServiceProvider : string,
    otherReason : string,
    unassigned : string,
    noneReason : string,
    homeInfusionTherepy : string,
    closed: string,
    totalRecords: any,

}

export default DashBoardGetRequestAPIReponse;