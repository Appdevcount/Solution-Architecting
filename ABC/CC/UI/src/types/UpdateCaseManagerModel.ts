export class ResponseUpdateCaseManagerModel {
    apiResult: UpdateCaseManagerResponse[] = []
    apiError: string = ""
    apiresp : boolean = false
}

export interface UpdateCaseManagerResponse {
    FirstName: string;
    LastName: string;
    PhoneNumber: string;
    Extension: string;
    Email: string;
}
