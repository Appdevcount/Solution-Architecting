/* istanbul ignore file */
import { AxiosResponse } from "axios";
import config from "../config/config";
import api from "../utils/api";
import { ActivityResponse, ResponseActivityResponseModel, SearchRequestAPIResponse } from "../types/ActivityModel";


const baseUrl = `${config.apiUrl}CaseManagement/`;

export async function GetActivityDetails(RequestId: string) : Promise<ResponseActivityResponseModel>{
  let resp: ResponseActivityResponseModel = new ResponseActivityResponseModel();
  const response = await api(baseUrl).post(`GetActivity?careCoordinationEpisodeId=${RequestId}`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }).then((x) => {      
      if(x.data != null){       
          resp.apiResult = BindActivity(x.data);        
      }
    }).catch(err => {
      resp.apiResult = [];
      resp.apiError = "Something Went Wrong!! Search again.";
    })
  return resp;
}

function BindActivity(input: SearchRequestAPIResponse){
    let lst_result : ActivityResponse[] = [];
    const dataArray = Array.isArray(input.data) ? input.data : [input.data];
    dataArray.forEach((item) => {
      lst_result.push({
        CreatedBy: item.createdBy,
        Comment:item.comments,
        CreatedDate:item.createdDate,
        CareCoordinationEpisodeId:item.careCoordinationEpisodeId,
        CareCoordinationEpisodeDate:item.careCoordinationEpisodeDate,
        Id:item.id,
        UserId:item.userId,
        RoleType:item.roleType
      });
    });       
    return lst_result;
  }