/* istanbul ignore file */
interface DashBoardResultModel {
        AssignTo?: string,
        CreatedTime:string,
        FollowUpTime: string|null,
        Location: string,
        RequestId: string,
        Name: string,
        DOB: string,
        MemberId: string,
        ServiceType: string,
        IsRestrictedMember: boolean
        
}

export default DashBoardResultModel;

export class DashBoardCountsModel{
    
        CaseOpen : string = "";
        IsEscalated : string = "";
        IsNotEscalated : string = "";
        MissedStartOfCare : string = "";
        Assigned : string = "";
        HomeHealth : string = "";
        Dme : string = "";
        Sleep : string = "";
        Onp : string = "";
        MemberEscalation : string = "";
        MissedServices : string = "";
        FindServiceProvider : string = "";
        OtherReason : string = "";
        UnAssigned : string = "";
        NoneReason : string = "";
        HomeInfusionTherepy : string = "";
        Closed : string = "";
    
    
}

