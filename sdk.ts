import { IStatsChunk, IUploadStats } from './interfaces/IUpdateStats';

export class SDK implements IUploadStats {
  constructor() { }

  // should be called each second during a call
  // chunk contain stats data for a second
  // appendStats can be called like .appendStats({...}).appendStats({...}) with different timestamps
  // or different channels per the second
  appendStats( chunk: IStatsChunk ): SDK {
    return this;
  }

  finish(): boolean {
    return false;
  }
}