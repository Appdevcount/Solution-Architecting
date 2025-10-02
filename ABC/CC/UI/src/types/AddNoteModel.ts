export class ResponseAddNoteModel {
    apiResult: NoteResponseModel[] = []
    apiError: string = ""
}

export interface NoteResponseModel {
  CareCoordinationEpisodeId: string;
  CareCoordinationEpisodeDate: string;
  Notes: string;
  CreatedDate: string;
  }

