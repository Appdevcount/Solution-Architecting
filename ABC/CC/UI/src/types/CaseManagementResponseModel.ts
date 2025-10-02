interface CaseManagementResponseModel{
  data:{
  requestId: string,
  missedStartOfCare: boolean,
  missedStartOfCareReason: string,
  caseStatus: string,
  isEscalated: boolean,
  followUPDate: string,
  followUPNote: string,
  notes: string,
  createdBy: string,
  createdDate: string,
  firstName: string,
  lastName: string,
  phoneNumber: string,
  extension: string,
  email: string,
  isSuccess: boolean,
  error : string,
  requestType: string,
  closeReason: string,
  dateOfService: string,
  CareCoordinationEpisodeDate : string
  }
}

export default CaseManagementResponseModel;