/* istanbul ignore file */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { create } from 'domain';

export interface RequestInformation {
  RequestId: string;
  isEscalated: boolean;
  Status: string;
  MemberName: string;
  MemberDOB: string;
  MemberAge: number;
  MemberGender: string;
  MemberID: string;
  Insurance: string;
}

export interface MemberInformation {
  Name: string;
  DateOfBirth: string;
  Age: number;
  Gender: string;
  MemID: string;
  Insurance: string;
  Address: string;
  PrimaryLanguage: string;
  MemberId: string;
  InsuranceCategory: string;
  MemberQuickCreate: boolean;
  MemberPlanType: string;
  GroupName: string;
  PhoneNumber:string;
  PrimaryCarePhysician:string;
  TPA:string;
  MemberIPA:string;
  GroupId:string;
  LOBCode:string;
}

export interface FollowUpInformation {
  Date: string;
  Details: string;
}

export interface CareCoordinationInformation {
  ServiceType: string;
  ServiceSubType: string;
  Reason: string;
  StartOfCare: string;
}

export interface RequesterInformation {
  Name: string;
  PhoneNumber: string;
  Email: string;
  Facility: string;
}

export interface HealthPlanCaseManager {
  FirstName: string;
  LastName: string;
  PhoneNumber: string;
  Extension: string;
  Email: string;
}

export interface Note {
  CareCoordinationEpisodeId: string;
  CareCoordinationEpisodeDate: string;
  Id: number;
  Notes: string;
  CreatedBy: string;
  CreatedDate: string;
}


export interface ProcedureCode {
  procedureCode: string;
  procedureDesc: string;
}

export interface Attachment {
  DocName: string;
}
export interface CCSite {
  CareCoordinationEpisodeId: string;
  CareCoordinationEpisodeDate: string; 
  OAOSiteID: string;
  NonParSiteID: string;
  OldSiteID: string;
  SiteName: string;
  SiteAddr1: string;
  SiteAddr2: string;
  SiteCity: string;
  SiteState: string;
  SiteZip: string;
  SitePhone: string;
  SiteFax: string;
  SiteSpec1: string;
  SiteSpec2: string;
  SiteSpecDesc1: string;
  SiteSpecDesc2: string;
  SiteAlternateID: string;
  SiteNYMIPar: string;
  SteeragePosition: number;
  NPI: string;
  SiteIdent: number;
  SelectionMethodID: number;
  Email: string;
  PUSRDF: string; 
  SiteIPA: string;
  SiteEntity: string;
  SiteType: string;
  PhysicianName: string;
}
export interface RequestState {
  RequestId: string;
  MSOCtag: boolean;
  CompanyId:number;
  HealthPlan:string;
  AssignToId:string;
  StaffedRequest: boolean;
  OONBenefit:string;
  RequestInformation: RequestInformation | null;
  MemberInformation: MemberInformation | null;
  FollowUpInformation: FollowUpInformation | null;
  CareCoordinationInformation: CareCoordinationInformation | null;
  RequesterInformation: RequesterInformation | null;
  HealthPlanCaseManager: HealthPlanCaseManager | null;
  CCSite: CCSite | null;
  Notes: Note[] | null;
  ProcedureCode: ProcedureCode[] | null;
  Attachments: Attachment[] | null;

}

const initialState: RequestState = {
  RequestId: "",
  MSOCtag: false,
  CompanyId: 0,
  AssignToId:"",
  HealthPlan: '',
  StaffedRequest: true,
  OONBenefit: "",
  RequestInformation: {
    RequestId: "",
    isEscalated: false,
    Status: "",
    MemberName: "",
    MemberDOB: "",
    MemberAge: 0,
    MemberGender: "",
    MemberID: "",
    Insurance: ""
  },
  MemberInformation: {
    Name: "",
    DateOfBirth: "",
    Age: 0,
    Gender: "",
    MemID: "",
    Insurance: "",
    Address: "",
    MemberQuickCreate: false,
    PrimaryLanguage: "",
    MemberId: "",
    InsuranceCategory: "",
    MemberIPA:"",
    MemberPlanType: "",
    GroupName: "",
    PhoneNumber: '',
    PrimaryCarePhysician: '',
    TPA: '',
    GroupId: '',
    LOBCode: ''
  },
  FollowUpInformation: {
    Date: "",
    Details: ""
  },
  CareCoordinationInformation: {
    ServiceType: "",
    Reason: "",
    StartOfCare: "",
    ServiceSubType: ''
  },
  RequesterInformation: {
    Name: "",
    PhoneNumber: "",
    Email: "",
    Facility: ""
  },
  HealthPlanCaseManager: {
    FirstName: "",
    PhoneNumber: "",
    Extension: "",
    Email: "",
    LastName: ''
  },
  Notes: [
    {
      CareCoordinationEpisodeId: "",
      CareCoordinationEpisodeDate: '',
      Id: 0,
      Notes: "",
      CreatedBy: "",
      CreatedDate: ""
    }
  ],
  ProcedureCode: [
    {
      procedureCode: "",
      procedureDesc: ""
    }
  ],
  Attachments: [
    {
      DocName: ""
    }
  ],
  CCSite: null,
};

const requestSlice = createSlice({
  name: 'request',
  initialState,
  reducers: {
    setRequestDetails: (state, action: PayloadAction<RequestState>) => {
      return action.payload;
    },
    clearRequestDetails: () => {
      return initialState;
    },
  },
});

const reqSlice = createSlice({
  name: "request",
  initialState: {
    careCoordinationInfo: null,
  },
  reducers: {
    setCareCoordinationInformation(state, action) {
      state.careCoordinationInfo = action.payload;
    },
  },
});

const restrcitedSlice= createSlice({
  name: 'restricted',
  initialState:{isRestrictedGlobal: false},
  reducers:{
    setIsRestrictedGlobal : (state, action)=>{
      state.isRestrictedGlobal = action.payload;
    }
  }
});

export const{ setIsRestrictedGlobal } = restrcitedSlice.actions;

export const restrcitedReducer = restrcitedSlice.reducer;

export const { setCareCoordinationInformation } = reqSlice.actions;

export const { setRequestDetails, clearRequestDetails } = requestSlice.actions;

export default requestSlice.reducer;
