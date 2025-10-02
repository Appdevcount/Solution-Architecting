/* istanbul ignore file */
import { useSelector } from "react-redux";
import config from "../config/config";
import { ResponseProcedureCodeModel } from "../types/ResponseModel";
import api from "../utils/api";
import { useEffect, useState } from "react";
import { RootState } from "../state/store/store";
const baseUrl = `${config.apiUrl}RequestView/`;

export async function GetProcedureCode(HealthPlan: string,CompanyId:number,procValue: string) : Promise<ResponseProcedureCodeModel>
{
    let resp: ResponseProcedureCodeModel = new ResponseProcedureCodeModel();
    let data = JSON.stringify({
      "procedureCodeIDorDesc": procValue,
      "insCarrier": HealthPlan,
      "companyID": CompanyId
    });
    const response = await api(baseUrl).post('GetProcedureCodes', data, {
      headers: {
        // Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
        "X-API-KEY": "MyAPIKey7347627",
         Accept: "application/json",
      },
    }).then((x) => {
    if(x.data != null){
      if(x.data.isSuccess){
        resp.apiResult = x.data;
      }
      else{
        resp.apiError = x.data.error;
      }
    }
  }).catch(err => {
    resp.apiError = "Something Went Wrong!! Search again.";
  })
return resp;
}

export async function AddProcedureCode(requestId?: string, procCode?: string, procName?: string) : Promise<ResponseProcedureCodeModel>
{
  let resp: ResponseProcedureCodeModel = new ResponseProcedureCodeModel();
    let data = JSON.stringify({
      "episodeID": requestId,
      "procedureCode": procCode,
      "procedureDesc": procName,
      "privateDutyNurse": true,
      "customNeed": true
    });
    const response = await api(baseUrl).post('AddProcedureCode', data, {
      headers: {
        // Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
        "X-API-KEY": "MyAPIKey7347627",
         Accept: "application/json",
      },
    }).then((x) => {
    if(x.data != null){
      if(x.data.isSuccess){
        resp.apiResult = x.data;
      }
      else{
        //resp.apiResult = [];
        resp.apiError = x.data.error;
      }
    }
  }).catch(err => {
    //resp.apiResult = [];
    resp.apiError = "Something Went Wrong!! Search again.";
  })
return resp;
}

export async function RemoveProcedureCode(requestId?: string, procCode?: string, procName?: string) : Promise<ResponseProcedureCodeModel>
{
  let resp: ResponseProcedureCodeModel = new ResponseProcedureCodeModel();
    let data = JSON.stringify({
      "episodeID": requestId,
      "procedureCode": procCode,
      "procedureDesc": procName,
      "privateDutyNurse": true,
      "customNeed": true
    });
    const response = await api(baseUrl).post('RemoveProcedureCode', data, {
      headers: {
        // Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
        "X-API-KEY": "MyAPIKey7347627",
         Accept: "application/json",
      },
    }).then((x) => {
    if(x.data != null){
      if(x.data.isSuccess){
        resp.apiResult = x.data;
      }
      else{
        resp.apiError = x.data.error;
      }
    }
  }).catch(err => {
    resp.apiError = "Something Went Wrong!! Search again.";
  })
return resp;
}

export interface ProcedureDetails{
  procedureCode: string;
  procedureDesc: string;
}