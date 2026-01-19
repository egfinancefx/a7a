
export interface QuestionData {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ImageFile {
  base64: string;
  mimeType: string;
  id: string;
}

export enum AppState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
