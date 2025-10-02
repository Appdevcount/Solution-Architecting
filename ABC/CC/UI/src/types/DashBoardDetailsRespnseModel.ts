/* istanbul ignore file */
import DashBoardResultModel, { DashBoardCountsModel } from "./DashBoardResultModel";

export class ResponseDashBoardDetailsModel {
    apiResult: DashBoardResultModel[] = []
    apiCountResult: DashBoardCountsModel = new DashBoardCountsModel();
    apiError: string = ""
    totalRecords:number=0
    apiresp: boolean = false
}


export interface ResponseAssignCaseModel{
    isSuccess : Boolean;
    error : string| null;

}

export interface AssigneeDetailsResponse{
    assigneeName : string [];
    assigneeUser: string[];
    isSuccess: boolean;
    error: string | null;
}
