/* istanbul ignore file */
import config from "../config/config";
import api from "../utils/api";
import { ActivityResponse, EligibilityAPIResponse, EligibilityDetailsResponse, EligibilityResponse, PatientDetailsResponse, PatientResponseRecord, ResponseActivityResponseModel, SearchRequestAPIResponse } from "../types/LookupRequest";
import { SiteSearchResponse } from "../types/SiteSearchResponse";
import { GetSiteDetailsRequestModel } from "../types/GetSiteDetailsRequestModel";

const baseUrl = `${config.apiUrl}lookup/`;

  export const formatDateToMMDDYYY = (dateString : string): string =>{
    const [year, month, day] = dateString.split('-');
    return `${month}/${day}/${year}`;
  }

  export const formatCompactDateToMMDDYYY = (compactDate : string): string =>{
    if(!compactDate || compactDate.length !== 8)return compactDate;
    const year = compactDate.substring(0,4);
    const month = compactDate.substring(4,6);
    const day = compactDate.substring(6,8);
    return `${month}/${day}/${year}`;
  }
  
  export async function PatientLookupAPI(model: any) : Promise<PatientDetailsResponse>{
    model.memberDOB = formatDateToMMDDYYY(model.memberDOB)
    
    let resp: PatientDetailsResponse = new PatientDetailsResponse();
    let data = JSON.stringify({
      "carrier": "cigna",
      "counter": "",
      "patientState": "",
      "patientID": model.memberId,
      "patientGroupNumber": "",
      "patientDob": model.memberDOB,
      "patientFirstName": model.memberFirstName,
      "patientLastName": model.memberLastName,
      "dos": "",
      "plan1": "",
      "plan2": "",
      "cpTcode": "",
      "companyId": "",
      "requestedBy": "",
      "providerNPI": ""
    });

    const response = await api(baseUrl).post(`GetMemberDetails`,data, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-API-KEY": "MyAPIKey7347627"
        },
      }).then((x) => {      
        if(x.data != null){       
            resp.apiResult = BindActivity(x.data);     
            resp.erisa = x.data[0].response.erisa;     
            resp.fundingType = x.data[0].response.fundingType;
            resp.language = x.data[0].response.language;   
        }
      }).catch(err => {
        resp.apiResult = [];
        resp.apiError = "Something Went Wrong!! Search again.";
      })
    return resp;
  }

  export async function PaitentEligibility(model : any):Promise<EligibilityDetailsResponse>{
    let resp: EligibilityDetailsResponse = new EligibilityDetailsResponse();
    
    let data = JSON.stringify({
      "qualifiers": {
        "reviewType": "procedure",
        "workflow": "qwe",
        "patientID": model.MemberId,
        "patientMemberCode": "2",
        "dos": "2025-02-28T04:10:33.062Z",
        "insCarrier": "cigna",
        "patientDOB": model.MemberDOB,
        "modality": "k1j",
        "companyID": "1",
        "dmeBenefit": "string",
        "cplntp": "string",
        "insPlanType": "string",
        "groupNumber": "string",
        "patientState": "string",
        "jurisdictionState": "string",
        "cptCode": "string",
        "environment": "string",
        "clientSystem": "eefd"
      }
    });
    var APIResponse = null;

    const response = await api(baseUrl).post(`MemberEligibility`,data, {
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": "MyAPIKey7347627",
          Accept: "application/json",
        },
      }).then((x) => {      
        if(x.data != null){       
          resp.apiResult = BindEligibility(x.data);  
        }
      }).catch(err => {
        resp.apiResult = [];
        resp.apiError = "Something Went Wrong!! Search again.";
      })
    return resp;
  }
  
  function BindActivity(input: SearchRequestAPIResponse){
      let lst_result : ActivityResponse[] = [];
      const dataArray = Array.isArray(input[0].response?.patient) ? input[0].response?.patient : [input[0].response?.patient];
      dataArray.forEach((item) => {
        lst_result.push({
          patientID: item.patientID,
          firstName: item.firstName,
          lastName: item.lastName,
          patientAddr1: item.patientAddr1,
          patientAddr2: item.patientAddr2,
          patientDOB: item.patientDOB,
          patientEffDate: item.patientEffDate,
          patientTermDate: item.patientTermDate,
          patientName: item.patientName,
          patientCity: item.patientCity,
          patientState: item.patientState,
          patientZip: item.patientZip,
          patientGender: item.patientGender,
          patientPhone: item.cellPhone,
          patientGroupNumber: item.patientGroupNumber,
          patientGroupDescription: item.patientGroupDescription,
          oAOSubNo: item.oAOSubNo,
          oAOPerNo: item.oAOPerNo,
          entity: item.entity,
          planCode: item.planCode,
          planType: item.planType,
          jurisdictionState: item.jurisdictionState,
          lineOfBusiness: item.lineOfBusiness,
          iPACode: item.ipaCode,
          patientPUSRDF: item.patientPUSRDF,
          patientPlanNetworkIndicator: item.patientPlanNetworkIndicator,
          extID: item.extID,
          patientORGCD: item.patientORGCD,
          cellPhone: item.cellPhone,
          defaultPlanCode: item.defaultPlanCode,
          memberCode: item.memberCode,
          ssnum: item.ssnum,
          cPECFL: item.cPECFL,
          cPECFD: item.cPECFD,
          cPBPID: item.cPBPID,
          tIT19: item.tIT19,
          eMAIL: item.eMAIL,
          category: item.category,
          cPEFDT: item.cPEFDT,
          isRestrictedMember: item.isRestrictedMember
        });
      });       
      return lst_result;
    }

    function BindEligibility(input: EligibilityAPIResponse []){
      let lst_result : EligibilityResponse[] = [];
      input.forEach((item) => {
        lst_result.push({
          caseBuild:item.caseBuild,
          companyID: item.companyID,
          cplntp: item.cplntp,
          cptCode: item.cptCode,
          dos: item.dos,
          insCarrier: item.insCarrier,
          memberInScope: item.memberInScope,
          planTypeEligible: item.planTypeEligible
        });
      });       
      return lst_result;
    }
  
  export async function SiteLookup(model: any) {
    try {     
      
      
      let resp!: SiteSearchResponse ;
      
      let request: GetSiteDetailsRequestModel = {
        providerCity : model.ProviderCity,
        providerEligibilityType : model.ProviderEligibilityType,
        providerNPI : model.ProviderNPI,
        providerName : model.ProviderName,
        providerOAOID : model.ProviderOAOID,
        providerTIN : model.ProviderTIN,
        providerZip : model.ProviderZip,
        memberIPA: model.memberIPA,
        requestId : model.RequestId
      }

      const response = await api(baseUrl).post('GetSiteDetails', request, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-API-KEY": "MyAPIKey7347627"
        },
      });
    return response.data;

    } catch (error) {
      console.error("Error :", error);
      throw new Error('Unable to Search Provider.Please try again later');
    }
  }
