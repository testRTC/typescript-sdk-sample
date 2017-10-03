import { ITestRTCStats } from './interfaces/ITestRTCStats';
import { IStatsChunk, IUploadStats } from './interfaces/IUpdateStats';

export class SDK implements IUploadStats {
  constructor() { }

  appendStats( chunk: IStatsChunk ): SDK {
    return this;
  }

  finish(): ITestRTCStats {

    return {};
  }
}