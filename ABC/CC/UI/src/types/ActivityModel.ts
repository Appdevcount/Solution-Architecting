
export class ResponseActivityResponseModel {
    apiResult: ActivityResponse[] = []
    apiError: string = ""
}

export interface ActivityResponse {
    CareCoordinationEpisodeId: string;
    CareCoordinationEpisodeDate: string;
    Id: string;
    UserId: string;
    RoleType: string;
    Comment: string;
    CreatedBy: string;
    CreatedDate: string;
}

export interface SearchRequestAPIResponse{
    data:{
    careCoordinationEpisodeId: string;
    careCoordinationEpisodeDate: string;
    id: string;
    userId: string;
    roleType: string;
    comments: string;
    createdBy: string;
    createdDate: string;
    }
};
