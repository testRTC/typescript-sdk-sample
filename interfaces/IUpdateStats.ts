import { ITestRTCStats } from './ITestRTCStats';
import { SDK } from '../sdk';

export interface IStatsChunk {
  values: any[];
}

export interface IUploadStats {
  appendStats( chunk: IStatsChunk ): SDK;
  finish(): ITestRTCStats;
};