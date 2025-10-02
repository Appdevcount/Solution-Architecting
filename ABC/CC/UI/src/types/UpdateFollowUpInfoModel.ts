export class ResponseFollowUpInfoModel {
    apiResult: UpdateFollowUpInfoResponse[] = []
    apiError: string = ""
    apiResp: boolean = false
}

export interface UpdateFollowUpInfoResponse {
    Date : string,
    Details : string
  
}
