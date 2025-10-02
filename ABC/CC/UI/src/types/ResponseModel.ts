import { ProcedureDetails } from "../services/ProcedureCodeSevice";

export class ResponseProcedureCodeModel {
    apiResult: ProcedureCodeApiResult = new ProcedureCodeApiResult();
    apiError: string = ""
    apiResp: boolean = false
}

export class ProcedureCodeApiResult {
    error : string | null = null;
    isSuccess: boolean = false ;
    procedureCodeDetails : ProcedureDetails[] = [];
 }


