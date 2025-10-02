/* istanbul ignore file */
import { AxiosResponse } from "axios";
import config from "../config/config";
import DashBoardResultModel, { DashBoardCountsModel } from "../types/DashBoardResultModel";
import { AssigneeDetailsResponse, ResponseAssignCaseModel, ResponseDashBoardDetailsModel } from "../types/DashBoardDetailsRespnseModel";
import api from "../utils/api";
import DashBoardGetRequestAPIReponse from "../types/DashBoardGetRequestAPIResponse";
import { useSelector } from "react-redux";
import { RootState } from "../state/store/store";
const baseUrl = `${config.apiUrl}Dashboard/`;


export async function GetAssignees(userName: string): Promise<AssigneeDetailsResponse> {

  try{
  const response = await api(baseUrl).get(`GetAssigneeDetails?userName=${userName}`, {
      headers: {
       // Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    return response.data;
  }
    catch(error){
      throw new Error('Can not load User .Please try again later');
    }
      
};

export async function AssignCases(careCoordinationEpisodeIDs : any, assigneeName: string)  : Promise<ResponseAssignCaseModel>{
  const body = {
    "careCoordinationEpisodeIDs" : careCoordinationEpisodeIDs,
    "assigneeName" : assigneeName
    
  };
  try{
  const response = await api(baseUrl).post('DashBoardCaseAssignment', body, {
      headers: {
       // Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    return response.data;
  }
    catch(error){
      console.error('Failed to Assign case', error);
      throw new Error('Unable to assign case.Please try again later');
    }
}

export async function GetDashBoardDetails(userName: string, pageSize: any , pageIndex: any, filerDetails:any)  : Promise<ResponseDashBoardDetailsModel>{
  let resp: ResponseDashBoardDetailsModel = new ResponseDashBoardDetailsModel();
  const body = {
    "userName" :userName,
    "pageSize":pageSize,
    "pageIndex":pageIndex,
    "filterDetails":filerDetails
   
  };
  const response = await api(baseUrl).post('GetDashboardDetails', body, {
      headers: {
        // Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
        "X-API-KEY": "MyAPIKey7347627",
        Accept: "application/json",
      },
    }).then((x) => {
      if(x.data != null){
        if(x.data.isSuccess){
          resp.apiResult = GetApiData(x.data);
          resp.apiCountResult = GetCountData(x.data);
          resp.totalRecords=x.data.totalRecords;
          if (x.data.isSupervisor) {
            resp.apiresp = true
          }
                   
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

function GetApiData(input: DashBoardGetRequestAPIReponse){
  let lst_result : DashBoardResultModel[] = [];
    const dataArray = Array.isArray(input.dashboardDetails) ? input.dashboardDetails : [input.dashboardDetails]; 
    dataArray.forEach((detail) => {
      lst_result.push({
        AssignTo: detail.assigneeName,
        CreatedTime:detail.createdDateTime !== null ? detail.createdDateTime.replace('T', ' ') : "",
        FollowUpTime:detail.followupDate !== '0001-01-01T00:00:00' && detail.followupDate !== '1900-01-01T00:00:00'? detail.followupDate.replace('T', ' ') : null,
        Location: detail.patientCity,
        RequestId: detail.careCoordinationEpisodeID,
        Name: detail.patientName,
        DOB: detail.patientDOB !== null ? formatDate(detail.patientDOB): detail.patientDOB,
        MemberId: detail.patientID,
        ServiceType: detail.subServiceType,
        IsRestrictedMember: detail.isRestrictedMember
    });
    });
   
  
  return lst_result;
}

function GetCountData(input: DashBoardGetRequestAPIReponse){
  let lst_result : DashBoardCountsModel =
  {
    
    CaseOpen :input.dashboardCounts.casesOpen,
    IsEscalated : input.dashboardCounts.isEscalated,
    IsNotEscalated : input.dashboardCounts.isNotEscalated,
    MissedStartOfCare : input.dashboardCounts.missedStartOfCare,
    Assigned : input.dashboardCounts.assigned,
    HomeHealth : input.dashboardCounts.homeHealth,
    Dme : input.dashboardCounts.dme,
    Sleep : input.dashboardCounts.sleep,
    Onp : input.dashboardCounts.onP,
    MemberEscalation : input.dashboardCounts.memberEscalation,
    MissedServices : input.dashboardCounts.missedServices,
    FindServiceProvider : input.dashboardCounts.findServiceProvider,
    OtherReason : input.dashboardCounts.otherReason,
    UnAssigned : input.dashboardCounts.unassigned,
    NoneReason : input.dashboardCounts.noneReason,
    HomeInfusionTherepy : input.dashboardCounts.homeInfusionTherepy,
    Closed : input.dashboardCounts.closed
  } 
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
