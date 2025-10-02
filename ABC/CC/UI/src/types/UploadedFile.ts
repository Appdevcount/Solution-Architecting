export interface UploadedFile {
    id: string | null;
    requestId: string | null;
    episodeId: string | null;
    file: any;
    objectId: number;
    filename: string | null;
    description: string | null;
    createdDate: string | null;
    objectClassKey: string | null;
    objectClassDescription: string | null;
    createdBy: string | null;
    policy: string | null;
    objectSize: number;
    documentType: string | null;
    userName: string | null;
}