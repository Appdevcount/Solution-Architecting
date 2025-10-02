export class AttachmentAPIResModel {
    apiResult: [] = [];
    amsObjectValetId: string = "";
    apiError: string = "";
    fileUploadSuccess: boolean = false;
}
export interface UploadedFileResDataModel{
    Id:string ;
    RequestId:string ;
    EpisodeId:string ;
    ObjectId :number;
    Filename:string ;
    Description:string ;
    CreatedDate:string ;
    ObjectClassKey:string ;
    ObjectClassDescription:string ;
    CreatedBy:string ;
    Policy:string ;
    ObjectSize: number;
 }
 export interface UploadedFileResModelStructure{
    uploadedFileList: {
    id:string ;
    requestId:string ;
    episodeId:string ;
    objectId :number;
    filename:string ;
    description:string ;
    createdDate:string ;
    objectClassKey:string ;
    objectClassDescription:string ;
    createdBy:string ;
    policy:string ;
    objectSize: number;
 }
}
 export class UploadedFileResModel {
    apiResult: UploadedFileResDataModel[] = []
    apiError: string = "";
}

