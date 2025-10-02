/* istanbul ignore file */
import config from "../config/config";
import { CCSite, RequestState } from "../state/reducers/requestSlice";
import { CareCoordinationRequest } from "../types/CareCoordinationRequest";
import {NoteResponseModel, ResponseAddNoteModel} from '../types/AddNoteModel';
import {UpdateFollowUpInfoResponse, ResponseFollowUpInfoModel} from '../types/UpdateFollowUpInfoModel';
import { SearchRequestAPIResponse } from "../types/SearchRequestAPIResponse";
import api from '../utils/api';
import { getToken } from "../utils/authtokenhandler";
import { ResponseType } from "axios";
import { UpdateCaseManagerResponse, ResponseUpdateCaseManagerModel } from '../types/UpdateCaseManagerModel';
import CaseManagementResponseModel from "../types/CaseManagementResponseModel";
import { formatCompactDateToMMDDYYY, formatDateToMMDDYYY } from "./LookupService";
import { ResponseCareCoordinationModel } from "../types/UpdateCareCoordinationModel";
import { ResponseAddTagsModel } from "../types/ResponseAddTagsModel";
import { ResponseCloseRequestModel } from "../types/ResponseCloseRequestModel";

const baseUrl = config.apiUrl;



const errorMsg = "Error creating request:";

export const formatDateToYYYYDDMM = (dateString : string): string =>{
  const [month, day, year] = dateString.split("/");
  return `${year}-${month}-${day}`;
}

export async function GetRequest(RequestId: string) : Promise<RequestState | null>{
 try {
  const url = `${baseUrl}requestSearch/`;
  const response = await api(url).get(`GetRequestDetailsById?id=${RequestId}`, {
      headers: {
        //Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if(response?.data){
      const mappedData = BindRequestData(response.data);
      return mappedData;
    }
    else{
      console.warn("No Data returned from API");
      return null;
    }
  }catch(error){

    console.error("Error fetching request details:", error);
    return null;
  }
    
}


function BindRequestData(input: SearchRequestAPIResponse):RequestState{
    return {
      RequestId: input.careCoordinationEpisodeId,
      MSOCtag: input.missedStartOfCare,
      CompanyId: input.companyId,
      HealthPlan: input.healthPlan,
      AssignToId: input.assigneeName,
      StaffedRequest:input.staffedRequest,
      OONBenefit:input.oon,
      RequestInformation :{
        RequestId: input.careCoordinationEpisodeId ,
        isEscalated: input.isEscalated,
        Status: input.caseStatus ,
        MemberName: input.patientDetails.name,
        MemberDOB: input.patientDetails.dateOfBirth,
        MemberAge: input.patientDetails.dateOfBirth !== null ? CalculateAge(input.patientDetails.dateOfBirth): null,
        MemberGender:input.patientDetails.patientSex,
        MemberID:input.patientDetails.patientID ,
        Insurance: input.healthPlan
        
      },
      MemberInformation : input.patientDetails ? {
        Name: input.patientDetails.name,
        DateOfBirth: input.patientDetails.dateOfBirth !== null ? formatDate(input.patientDetails.dateOfBirth) : input.patientDetails.dateOfBirth ,
        Age: input.patientDetails.dateOfBirth !== null ? CalculateAge(input.patientDetails.dateOfBirth) : null,
        Gender:input.patientDetails.patientSex,
        MemID: input.patientDetails.patientID,
        Insurance: input.healthPlan,
        Address: input.patientDetails.patientAddr1 + "," + input.patientDetails.patientCity + "," + input.patientDetails.patientState,
        PrimaryLanguage:input.patientDetails.language ,
        MemberQuickCreate:input.patientDetails.memberQuickCreate,
        MemberId: input.patientDetails.patientID ,
        InsuranceCategory: input.patientDetails.category ,
        MemberPlanType: input.patientDetails.patientPlanType ,
        MemberIPA:input.patientDetails.ipa,
        GroupName: input.patientDetails.calculated_PatientID_PatientMemberCode_GroupNumber ,
        PhoneNumber: input.patientDetails.cellPhone,
        PrimaryCarePhysician: input.patientDetails.pusrdf,
        TPA:input.patientDetails.tiT19,
        GroupId:input.patientDetails.groupNumber,
        LOBCode:input.patientDetails.lineOfBusiness
      } : null,
      FollowUpInformation : input.followUp ? {
        Date : formatDate(input.followUp.followUpDate),
        Details: input.followUp.notes
      } : null,
      CareCoordinationInformation: {
        ServiceType:input.program,
        ServiceSubType:input.subServiceType,
        Reason : input.reason,
        StartOfCare : formatDate(input.dateOfService)
      },
      RequesterInformation: input.requester ? {
        Name: [input.requester?.lastName , input.requester?.firstName].filter(Boolean).join(', '),
        PhoneNumber: input.requester.contactNumber,
        Email:input.requester.email,
        Facility: input.requester.facility
      } : null,
      HealthPlanCaseManager: input.caseManager ? {
        FirstName: input.caseManager.firstName,
        LastName:  input.caseManager.lastName,
        PhoneNumber:  input.caseManager.phoneNumber,
        Extension:  input.caseManager.extention,
        Email: input.caseManager.email
      } : null,
      CCSite: input.site ? {
        CareCoordinationEpisodeId: input.careCoordinationEpisodeId,
        CareCoordinationEpisodeDate: input.careCoordinationEpisodeDate, 
        OAOSiteID: input.site.oaoSiteID ,
        NonParSiteID: input.site.nonParSiteID ,
        OldSiteID: input.site.oldSiteID,
        SiteName:input.site.name ,
        SiteAddr1: input.site.addr1 ,
        SiteAddr2: input.site.addr2,
        SiteCity: input.site.city ,
        SiteState:input.site.state ,
        SiteZip: input.site.zip ,
        SitePhone: input.site.phone,
        SiteFax: input.site.fax ,
        SiteSpec1: input.site.spec1 ,
        SiteSpec2: input.site.spec2,
        SiteSpecDesc1: input.site.specDescription1 ,
        SiteSpecDesc2: input.site.specDescription2 ,
        SiteAlternateID:input.site.alternateID ,
        SiteNYMIPar: input.site.nymiPar,
        SteeragePosition: input.site.steeragePosition,
        NPI: input.site.npi,
        SiteIdent:input.site.siteIdent,
        SelectionMethodID: input.site.selectionMethodID,
        Email:input.site.email ,
        PUSRDF: input.site.pusrdf, 
        SiteIPA: input.site.ipa ,
        SiteEntity:input.site.entity ,
        SiteType: input.site.siteType,
        PhysicianName: input.site.PhysicianName,
      } : null,
      Notes: Array.isArray(input.notes)? input.notes.map(note => ({
        CareCoordinationEpisodeId: input.careCoordinationEpisodeId,
        CareCoordinationEpisodeDate: input.careCoordinationEpisodeDate ,
        Id: note.id ,
        Notes: note.notes ,
        CreatedBy: note.createdBy ,
        CreatedDate: note.createdDate.replace('T', ' ') ,
      })):null,
      ProcedureCode:Array.isArray(input.cptCodes)? input.cptCodes.map(procedure => ({
        procedureCode: procedure.cptCode,
        procedureDesc: procedure.simplifiedDescription
      })) : null,
      Attachments: Array.isArray(input.attachments)? input.attachments.map(attachment => ({
        DocName: attachment.attachmentName
      })) : null
    }
 
}

function CalculateAge(dateString: string): any
{
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();

    if(month < 0 || (month === 0 && today.getDate() < birthDate.getDate())){
      age--;
    }
    return age;
}

function formatDate(dateString: string): string {
  let date;
  if(dateString == null || dateString.indexOf("T") > -1) {  
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

export function formatDateDashTOSlash(dateString: string): string {
  let date;
  if(dateString != null)
  {
    const [year, month, day] = dateString.split("-").map(Number);
    date = new Date(year, month - 1, day);
  }
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
}

export async function CreateRequest(model: any) {
  try {
      const url = `${baseUrl}requestCreation/`;
      var data = JSON.stringify({
        "episodeId": model.RequestId,
        "companyId": ProgramToCompanyId(model.CareCoordinationType),
        "healthPlan": model.InsurerName,
        "reason": model.Reason,
        "notes": model.Notes,
        "dateOfService": model.StartOfCare,
        "isEscalated": model.isEscalated,
        "requestor": {
          "firstName": model.RequesterFirstName,
          "lastName": model.RequesterLastName,
          "phoneNumber": model.RequesterPhoneNumber,
          "extension": model.Extension,
          "fax": model.RequesterFaxNumber,
          "email": model.RequesterEmail,
          "facility": model.RequesterFacility
        },
        "patientDetails": {
          "id": model.MemberId,
          "name": model.MemberFullName,
          "addr1": model.MemberAddress1,
          "addr2": model.MemberAddress2,
          "city": model.MemberCity,
          "state": model.MemberState,
          "zip": model.MemberZip,
          "sex": model.MemberGender,
          "phone": model.MemberPhoneNumber,
          "dob": model.MemberDOB.includes('/') ? formatDateToYYYYDDMM(model.MemberDOB): model.MemberDOB,
          "oaoSubNo": model.MemberOaoPerNo,
          "oaoPerNo": model.MemberOaoSubNo,
          "oaoEmpNo": model.MemberId,
          "memberCode": model.MemberCode,
          "groupNumber": model.MemberGroupId,
          "planType": model.MemberPlanType,
          "lineOfBusiness": model.MemberLOBCode,
          "language": model.MemberPrimaryLanguage,
          "patientPlanType": model.MemberPlanType,
          "entity": model.MemberEntity,
          "category": model.MemberCategory,
          "ipa": model.MemberIPACode,
          "ident": 0, //Not Found
          "email": model.MemberEmail,
          "cellPhone": model.MemberCellPhone,
          "jurisdictionState": model.MemberJurisdictionState,
          "tiT19": model.MemberTiT19,
          "caseFactor": 0, //Not Found
          "pusrdf": model.MemberPusrdf,
          "fundType": model.MemberFundingType,
          "erisa": model.MemberErisa,
          "extid": model.MemberExtId,
          "memberStartDate": (model.MemberEffectiveDate && model.MemberEffectiveDate.length == 8) ? formatDateToYYYYDDMM(formatCompactDateToMMDDYYY(model.MemberEffectiveDate)) : null,
          "IsQuickCreate": model.IsQuickCreate,
          "IsRestrictedMember": model.IsRestrictedMember
        },
        "staffedRequest": model.IsStaffingRequest, //Not found
        "subServiceType": model.CareCoordinationSubType
      });
      const response = await api(url).post('SaveCareCordinationRequest', data, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-API-KEY": "MyAPIKey7347627"
        },
      });
      return {
      RequestId: response?.data?.episodeId,
      RequestInformation: null,
      MemberInformation: null,
      FollowUpInformation: null,
      CareCoordinationInformation: null,
      RequesterInformation: null,
      HealthPlanCaseManager: null,
      Notes: [],
      ProcedureCode: [],
      Attachments: []
    };
  } catch(error){
    // console.error('Failed to get Assignee Details', error);
    throw new Error('Case can not be created with these details.Please provide correct details!');
  }
}


export async function UpdateFollowUpInfo(FollowUpDate: string, FollowUpNote:string,RequestId: string, CreatedBy: string) : Promise<ResponseFollowUpInfoModel>{ 
  let resp : ResponseFollowUpInfoModel = new ResponseFollowUpInfoModel();
  const body = {
  "followUpDate" : FollowUpDate,
  "followUpNote" : FollowUpNote,
  "requestId" : RequestId,
  "createdBy" : CreatedBy
  }
  const url = `${baseUrl}CaseManagement/`;
  const response = await api(url).post('UpdateFollowUpDate', body, {
    headers: {
      // Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  }).then((x) => {
        if(x.data != null){         
            resp.apiResp = true;         
          }
        
      }).catch(err => {
        
        resp.apiError = "Something Went Wrong!! Search again.";
      })
    return resp;
};

export async function AddNote(Notes: string, RequestId: string, CreatedBy: string): Promise<ResponseAddNoteModel>{ 
  let resp : ResponseAddNoteModel = new ResponseAddNoteModel();
  const body = {
  "notes" : Notes,
  "requestId" : RequestId,
  "createdBy" : CreatedBy
  };
  const url = `${baseUrl}CaseManagement/`;
  const response = await api(url).post('AddNote', body, {
    headers: {
      // Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  }).then((x) => {
    if(x.data != null){
      if(x.data.data.isSuccess){
        resp.apiResult = GetNoteData(x.data);
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
};
 

function GetNoteData(input: CaseManagementResponseModel){
  let lst_result : NoteResponseModel[] = [];
  const dataArray = Array.isArray(input.data) ? input.data : [input.data];
    dataArray.forEach((item) => {
    lst_result.push({
       CareCoordinationEpisodeId :item.requestId,
       CareCoordinationEpisodeDate :item.CareCoordinationEpisodeDate,
       Notes: item.notes,     
       CreatedDate : item.createdDate.replace('T', ' ')
    });
  });
 
  return lst_result;
}

export async function UpdateMSOC(Reason: string,RequestId: string, CreatedBy: string) :Promise<ResponseAddTagsModel> { 
  let resp : ResponseAddTagsModel = new ResponseAddTagsModel();
  const body = {
  "missedStartOfCareReason" : Reason,
  "missedStartOfCare" : true,
  "requestType" : "MSOC",
  "requestId" : RequestId,
  "createdBy" : CreatedBy
  }
  const url = `${baseUrl}CaseManagement/`;
  const response = await api(url).post('UpdateMSOCorDOS', body, {
    headers: {
      // Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  }).then((x) => {
        if(x.data != null){         
            resp.apiResp = true;         
          }
        
      }).catch(err => {
        
        resp.apiError = "Something Went Wrong!! Search again.";
      })
    return resp;
  };

  export async function UndoMSOC(RequestId: string, CreatedBy: string): Promise<ResponseAddTagsModel> { 
    let resp : ResponseAddTagsModel = new ResponseAddTagsModel();
    const body = {
    "missedStartOfCareReason" :null,
    "missedStartOfCare" : false,
    "requestType" : "MSOC",
    "requestId" : RequestId,
    "createdBy" : CreatedBy
    }
    const url = `${baseUrl}CaseManagement/`;
    const response = await api(url).post('UpdateMSOCorDOS', body, {
      headers: {
        // Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }).then((x) => {
          if(x.data != null){         
              resp.apiResp = true;         
            }
          
        }).catch(err => {
          
          resp.apiError = "Something Went Wrong!! Search again.";
        })
      return resp;
    };

  export async function UpdateEscalate(RequestId: string, CreatedBy: string) : Promise<ResponseAddTagsModel> { 
    let resp : ResponseAddTagsModel = new ResponseAddTagsModel();
    const body = {
    "IsEscalated" : true,
    "requestId" : RequestId,
    "createdBy" : CreatedBy
    }
    const url = `${baseUrl}CaseManagement/`;
    const response = await api(url).post('UpdateIsEscalateRequest', body, {
      headers: {
        // Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }).then((x) => {
          if(x.data != null){         
              resp.apiResp = true;         
            }
          
        }).catch(err => {
          
          resp.apiError = "Something Went Wrong!! Search again.";
        })
      return resp;
    };  
    
    export async function UndoEscalate(RequestId: string, CreatedBy: string) : Promise<ResponseAddTagsModel> { 
      let resp : ResponseAddTagsModel = new ResponseAddTagsModel();
      const body = {
      "IsEscalated" : false,
      "requestId" : RequestId,
      "createdBy" : CreatedBy
      }
      const url = `${baseUrl}CaseManagement/`;
      const response = await api(url).post('UpdateIsEscalateRequest', body, {
        headers: {
          // Authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }).then((x) => {
            if(x.data != null){         
                resp.apiResp = true;         
              }
            
          }).catch(err => {
            
            resp.apiError = "Something Went Wrong!! Search again.";
          })
        return resp;
      };
export async function UpdateCareCoordination(StartOfCare: string ,RequestId: string, CreatedBy: string) : Promise<ResponseCareCoordinationModel>{ 
  let resp : ResponseCareCoordinationModel = new ResponseCareCoordinationModel();
  const body = {
  "dateOfService" : StartOfCare,
  "requestId" : RequestId,
  "requestType" : "DOS",
  "createdBy" : CreatedBy
  }
  const url = `${baseUrl}CaseManagement/`;
  const response = await api(url).post('UpdateMSOCorDOS', body, {
    headers: {
      // Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  }).then((x) => {
        if(x.data != null){         
            resp.apiResp = true;         
          }
        
      }).catch(err => {
        
        resp.apiError = "Something Went Wrong!! Search again.";
      })
    return resp;
};
export async function ManageHealthPlanCaseManager(FirstName: string,LastName: string,PhoneNumber:string,Extension: string,Email: string, RequestId: string, CreatedBy: string): Promise<ResponseUpdateCaseManagerModel>{ 
  let resp : ResponseUpdateCaseManagerModel = new ResponseUpdateCaseManagerModel();
  const body = {
  "firstName" : FirstName,
  "lastName" : LastName,
  "phoneNumber" : PhoneNumber,
  "extension": Extension,
  "email": Email,
  "requestId": RequestId,
  "createdBy": CreatedBy

  }
  const url = `${baseUrl}CaseManagement/`;
  const response = await api(url).post('UpdateCaseManager', body, {
    headers: {
      // Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  }).then((x) => {
    if(x.data != null){
      if(x.data.data.isSuccess){
        resp.apiresp = true
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
};

export async function UpdateCCSite(model: any) {
  try {
    const url = `${baseUrl}lookup/`;
    const response = await api(url).post('UpsertSiteDetails', model, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-API-KEY": "MyAPIKey7347627"
      },
    });

    if (response != null && response.data === "SUCCESS"){
      let site: CCSite = {
        CareCoordinationEpisodeId: model.RequestId,
        CareCoordinationEpisodeDate: model.CareCoordinationEpisodeDate,
        OAOSiteID: model.OAOSiteID,
        NonParSiteID: model.NonParSiteID,
        OldSiteID: model.OldSiteID,
        SiteName: model.SiteName,
        SiteAddr1: model.SiteAddr1,
        SiteAddr2: model.SiteAddr2,
        SiteCity: model.SiteCity,
        SiteState: model.SiteState,
        SiteZip: model.SiteZip,
        SitePhone: model.SitePhone,
        SiteFax: model.SiteFax,
        SiteSpec1: model.SiteSpec1,
        SiteSpec2: model.SiteSpec2,
        SiteSpecDesc1: model.SiteSpecDesc1,
        SiteSpecDesc2: model.SiteSpecDesc2,
        SiteAlternateID: model.SiteAlternateID,
        SiteNYMIPar: model.SiteNYMIPar,
        SteeragePosition: model.SteeragePosition,
        NPI: (model.NPI != null) ? model.NPI : model.TIN,
        SiteIdent: model.SiteIdent,
        SelectionMethodID: model.SelectionMethodID,
        Email: model.Email,
        PUSRDF: model.PUSRDF,
        SiteIPA: model.SiteIPA,
        SiteEntity: model.SiteEntity,
        SiteType: model.SiteType,
        PhysicianName: model.PhysicianName,
      };
    return site;
    }
  } catch (error) {
    console.error("Error creating request:", error);
    throw error;
  }
}
export async function QuickCreateProvider(model: any) {
  try {

    var data = JSON.stringify({
      "CareCoordinationEpisodeId": model.RequestId,
      "OAOSiteID": "",
      "NonParSiteID": "",
      "OldSiteID": "",
      "SiteName": model.SiteName,
      "SiteAddr1": model.Address,
      "SiteAddr2": "",
      "SiteCity": model.City,
      "SiteState": model.State,
      "SiteZip": model.Zip,
      "SitePhone": model.Phone,
      "SiteFax": model.Fax,
      "SiteSpec1": "",
      "SiteSpec2": "",
      "SiteSpecDesc1": "",
      "SiteSpecDesc2": "",
      "SiteAlternateID": "",
      "SiteNYMIPar": "",
      "SteeragePosition": 0,
      "NPI": (model.NPI != null) ? model.NPI : model.TIN,
      "SiteIdent": 1,
      "SelectionMethodID": 1,
      "Email": "",
      "PUSRDF": "",
      "SiteIPA": "",
      "SiteEntity": "",
      "SiteType": "Manual"
    });
    
    const url = `${baseUrl}lookup/`;
    const response = await api(url).post('UpsertSiteDetails', data, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-API-KEY": "MyAPIKey7347627"
      },
    });
    if (response != null && response.data === "SUCCESS"){
      let testsite: CCSite = {
        CareCoordinationEpisodeId: model.RequestId,
        CareCoordinationEpisodeDate: '',
        OAOSiteID: '',
        NonParSiteID: '',
        OldSiteID: '',
        SiteName: model.SiteName,
        SiteAddr1: model.Address,
        SiteAddr2: '',
        SiteCity: model.City,
        SiteState: model.State,
        SiteZip: model.Zip,
        SitePhone: model.Phone,
        SiteFax: model.Fax,
        SiteSpec1: '',
        SiteSpec2: '',
        SiteSpecDesc1: '',
        SiteSpecDesc2: '',
        SiteAlternateID: '',
        SiteNYMIPar: '',
        SteeragePosition: 0,
        NPI: (model.NPI != null) ? model.NPI : model.TIN,
        SiteIdent: 101,
        SelectionMethodID: 202,
        Email: '',
        PUSRDF: '',
        SiteIPA: '',
        SiteEntity: '',
        SiteType: 'Manual',
        PhysicianName: ''
    };

    return testsite;
  }
  } catch (error) {
    console.error("Error creating request:", error);
    throw error;
  }
}



export async function CloseRequest(Reason: string, CaseStatus: string,RequestId: string, CreatedBy: string): Promise <ResponseCloseRequestModel>{
  let resp : ResponseCloseRequestModel = new ResponseCloseRequestModel();
  const body = {
  "caseStatus" : CaseStatus,
  "closeReason" : Reason,
  "requestId" : RequestId,
  "createdBy" : CreatedBy
  }
  const url = `${baseUrl}CaseManagement/`;
  const response = await api(url).post('UpdateCaseStatus', body, {
    headers: {
      // Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  }).then((x) => {
    if(x.data != null){         
        resp.apiResp = true;         
      }

  }).catch(err => {
    
    resp.apiError = "Something Went Wrong!! Search again.";
  })
return resp;
}; 

export async function QuickCreateMember(model: any) {
  try {

    let testsite = {
      CareCoordinationEpisodeId: 'CCE123456',
      CareCoordinationEpisodeDate: '2025-01-31',
      OAOSiteID: 'OAO78910',
      NonParSiteID: 'NPS112233',
      OldSiteID: 'OLD445566',
      SiteName: 'HealthCare Center',
      SiteAddr1: '123 Main St',
      SiteAddr2: 'Suite 400',
      SiteCity: 'Metropolis',
      SiteState: 'NY',
      SiteZip: '10001',
      SitePhone: '123-456-7890',
      SiteFax: '098-765-4321',
      SiteSpec1: 'Cardiology',
      SiteSpec2: 'Neurology',
      SiteSpecDesc1: 'Heart Specialist',
      SiteSpecDesc2: 'Brain Specialist',
      SiteAlternateID: 'ALT998877',
      SiteNYMIPar: 'NYMI1234',
      SteeragePosition: 1,
      NPI: 'NPI567890',
      SiteIdent: 101,
      SelectionMethodID: 202,
      Email: 'contact@healthcarecenter.com',
      PUSRDF: 'PUSRDF123',
      SiteIPA: 'IPA456',
      SiteEntity: 'Entity789'
  };
    return testsite;
    // return response.data;
  } catch (error) {
    console.error("Error creating request:", error);
    throw error;
  }
}

function ProgramToCompanyId(input: string){
  if(input != null){
    input = input.toUpperCase()
    switch(input){
      case "DME":
        return 15;
      break;
      case "HOME HEALTH":
        return 17;
      break;
      case "SLEEP":
        return 8;
      break;
      default:
        return 0;
    }
  }
}
