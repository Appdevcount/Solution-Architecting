export class ResponseCareCoordinationModel {
    apiResult: CareCoordinationResponseModel[] = []
    apiError: string = ""
    apiResp : boolean = false
}

export interface CareCoordinationResponseModel {
    ServiceType: string;
    ServiceSubType: string;
    Reason: string;
    StartOfCare: string;
  }

