/* istanbul ignore file */
import { AxiosResponse } from "axios";
import config from "../config/config";
import { SearchHistoricalAPIResponseModel, SearchRequestAPIResponse } from "../types/SearchRequestAPIResponse";
import SearchResultModel, { SearchHistoricalResultModel } from "../types/SearchResultModel";
import api from "../utils/api";
import { ResponseSearchHistoricalReqModel, ResponseSearchReqModel } from "../types/SearchRequestReponseModel";
const baseUrl = `${config.apiUrl}RequestSearch/`;
const APIUrl = `${config.apiUrl}HistoricalCase/`;

export async function SearchRequestById(RequestId: string,UserName:string) : Promise<ResponseSearchReqModel>{

  let resp: ResponseSearchReqModel = new ResponseSearchReqModel();
  const body = {
    "Id":RequestId,
    "Status":"ALL",
    "UserName":UserName
  };

  const response = await api(baseUrl).post('GetRequests',body, {
      headers: {
        //Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }).then((x) => {        
      if(x.data.isSuccess){       
          resp.apiResult = GetApiData(x.data.searchResults);        
      }
    }).catch(err => {
      resp.apiResult = [];
      resp.apiError = "Something Went Wrong!! Search again.";
    })
  return resp;
}

export async function SearchRequestByName(firstName: string,lastName: string,DOB: string,UserName:string)  : Promise<ResponseSearchReqModel>{
  let resp: ResponseSearchReqModel = new ResponseSearchReqModel();
  const body = {
    "firstName" : firstName,
    "lastName" : lastName,
    "dateOfBirth" : DOB !== "" ? formatDate(DOB) : "",
    "status" : "ALL",
    "userName": UserName
  };

  const response = await api(baseUrl).post('GetRequests', body, {
      headers: {
        // Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }).then((x) => {
      if(x.data != null){
        if(x.data.isSuccess){
          resp.apiResult = GetApiData(x.data.searchResults);
        }
        else{
          resp.apiResult = [];
          resp.apiError = x.data.error;
        }
      }
    }).catch(err => {
      resp.apiResult = [];
      resp.apiError = "Something Went Wrong!! Search again.";
    })
  return resp;
}

export async function SearchRequestInHistroy(RequestId: string) : Promise<ResponseSearchHistoricalReqModel>{
  let resp: ResponseSearchHistoricalReqModel = new ResponseSearchHistoricalReqModel();

  const response = await api(APIUrl).post(`GetHistoricalCaseData?requestId=${RequestId}`, {
      headers: {
        //Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }).then((x) => {        
      if(x.data != null){          
          resp.apiResult = GetApiHistoricalDataById(x.data);        
      }
    }).catch(err => {
      resp.apiResult = [];
      resp.apiError = "Something Went Wrong!! Search again.";
    })
  return resp;
}

function GetApiData(input: SearchRequestAPIResponse[]){
  let lst_result : SearchResultModel[] = [];
  input.forEach((x: SearchRequestAPIResponse) => {
    lst_result.push({
      CareCoordinationEpisodeId: x.careCoordinationEpisodeId,
      CareCoordinationEpisodeDate : x.careCoordinationEpisodeDate !== null ? formatDate(x.careCoordinationEpisodeDate) : x.careCoordinationEpisodeDate,
      CaseStatus:x.caseStatus,
      HealthPlan:x.healthPlan,
      CompanyId: x.companyId,
      Reason:x.reason,
      DateOfService: x.dateOfService !== null ? formatDate(x.dateOfService) : x.dateOfService,
      DateOfClosing:x.dateOfClosing !== null ? formatDate(x.dateOfClosing): x.dateOfClosing,
      IsEscalated: x.isEscalated,
      CreatedBy:x.createdBy,
      CreateDate: x.createDate !== null ? formatDate(x.createDate) : x.createDate,
      PatientID:x.patientDetails?.patientID,
      PatientName:x.patientDetails?.name,
      PatientDOB: x.patientDetails?.dateOfBirth !== null ? formatDate(x.patientDetails?.dateOfBirth) : x.patientDetails?.dateOfBirth,
      Program:x.program,
      IsRestrictedMember:x.isRestrictedMember
    })
  })
  return lst_result;
}

function GetApiHistoricalDataById(input: SearchHistoricalAPIResponseModel[]){
  let lst_result : SearchHistoricalResultModel[] = [];
    input.forEach((item : SearchHistoricalAPIResponseModel)=>{
    lst_result.push({
      ccRequestID: item.ccRequestID,
      ccCaseStatus:item.ccCaseStatus,
      ccReason:item.ccReason,
      caseManagerName: item.caseManagerName,
      socDate:item.socDate,
      member:{
        memberID:item.member?.memberID,
        memberPolicy:{
          insurer:item.member?.memberPolicy?.insurer,
          program:item.member?.memberPolicy?.program
        }
      },
      procedure: item.procedure?.map(proc=>({
        procedureCode:proc.procedureCode,
        procedureCodeDescription:proc.procedureCodeDescription
      })),
      servicingProvider:{
        physicianName:item.servicingProvider?.physicianName,
      },
    });
  });
  return lst_result;
}

function formatDate(dateString: string): string {
  let date;
  if(dateString.indexOf("T") > -1) {  
    date = new Date(dateString);
  }
  else {
    const [year, month, day] = dateString.split("-").map(Number);
    date = new Date(year, month - 1, day);
  }
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
}