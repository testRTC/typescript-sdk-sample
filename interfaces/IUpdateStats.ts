import { ITestRTCStats } from './ITestRTCStats';
import { SDK } from '../sdk';

export interface IStatsChunk {
  channelName: string;
  bytes: number;
  jitter: number;
  rtt: number;
  loss: number;
  media: string; // audio | video
  direction: string; // send | recv
  videoResolution?: string;
  videoFrameRate?: number;
}

export interface IUploadStats {
  appendStats( chunk: IStatsChunk ): SDK;
  finish(): boolean;
};