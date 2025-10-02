/* istanbul ignore file */
import config from "../config/config";
import api from "../utils/api";
import {AttachmentAPIResModel , UploadedFileResDataModel, UploadedFileResModel, UploadedFileResModelStructure} from "../types/AttachmentModel"
import axios from "axios";
import { getToken } from "../utils/authtokenhandler";
import { DeleteFilePropertiesViewModel } from "../types/DeleteFilePropertiesViewModel";
const baseUrl =  `${config.apiUrl}Attachments/`;

export async function uploadFile(formData : FormData) : Promise<AttachmentAPIResModel>
{
    let resp: AttachmentAPIResModel = new AttachmentAPIResModel();
    const response = await api(baseUrl).post('UploadFile', formData, {
      headers: {
        // Authorization: `Bearer ${getToken()}`,
        //"X-API-KEY": config.apiKey,
        "Content-Type": "multipart/form-data",
        //Accept: "application/json",
      },
    }).then((x) => {
    if(x.data != null){
      if(x.data.fileUploadSuccess){
        resp.amsObjectValetId = x.data.amsObjectValetId;
        resp.fileUploadSuccess = x.data.fileUploadSuccess;
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

export async function getUploadedFiles(EpisodeId: string) : Promise<UploadedFileResModel>{
  let resp: UploadedFileResModel = new UploadedFileResModel();
  const response = await api(baseUrl).get(`GetUploadedFiles/${EpisodeId}`, {
      headers: {
        // Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }).then((x) => {        
      if(x.data != null){       
          resp.apiResult = GetApiDataForUploadedFiles(x.data);        
      }
    }).catch(err => {
      resp.apiResult = [];
      resp.apiError = "Something Went Wrong!! Search again.";
    })
  return resp;
}

export async function downloadFile(ObjectId: string) {
  const response = await fetch(baseUrl+`DownloadFile/${ObjectId}`, {
    method: 'GET',
    headers: {
       Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  if(!response.ok){
    throw new Error ('Download failed')
  }
  return response;
}

export async function deleteFile(payload: DeleteFilePropertiesViewModel) {
  const url = `${baseUrl}DeleteFile`;
  const response = await axios.delete(url, { 
    data: payload, 
    headers: {
    Authorization: `Bearer ${getToken()}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
  
  if(response.data != null){
    return response.data;
  }
}

function GetApiDataForUploadedFiles(input: UploadedFileResModelStructure){
    let lst_result : UploadedFileResDataModel[] = [];
    const dataArray = Array.isArray(input.uploadedFileList) ? input.uploadedFileList : [input.uploadedFileList];
    dataArray.forEach((item) => {
      lst_result.push({
        Id: item.id,
        EpisodeId : item.episodeId,
        RequestId:item.requestId,
        ObjectId:item.objectId,
        Filename: item.filename,
        Description:item.description,
        CreatedDate: item.createdDate !== null ? formatDate(item.createdDate) : item.createdDate,
        ObjectClassKey:item.objectClassKey,
        CreatedBy:item.createdBy,
        ObjectClassDescription: item.objectClassDescription,
        Policy:item.policy,
        ObjectSize:item.objectSize
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