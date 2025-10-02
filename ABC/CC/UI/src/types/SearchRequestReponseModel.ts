import SearchResultModel, { SearchHistoricalResultModel } from "./SearchResultModel";

export class ResponseSearchReqModel {
    apiResult: SearchResultModel[] = []
    apiError: string = ""
}

export class ResponseSearchHistoricalReqModel {
    apiResult: SearchHistoricalResultModel[] = []
    apiError: string = ""
}