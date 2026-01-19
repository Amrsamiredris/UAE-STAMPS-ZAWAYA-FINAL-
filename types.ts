
export interface GeneratedStamp {
  id: string;
  theme: string;
  imageUrl: string;
  timestamp: number;
}

export enum AppStatus {
  IDLE = 'idle',
  GENERATING = 'generating',
  SUCCESS = 'success',
  ERROR = 'error'
}
