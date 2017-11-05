import { IStatsChunk, IUploadStats } from './interfaces/IUpdateStats';
import { Collector } from './sample/collector/Collector';
import {} from './'

// INFO: sample for customer how he/she should interact with testRTC SDK
export class SDK implements IUploadStats {
  constructor() {}

  // should be called each second during a call
  // chunk contain stats data per second
  // appendStats can be called like .appendStats({...}).appendStats({...}) with different timestamps
  // or different channels per the second
  appendStats( chunk: IStatsChunk ): SDK {
    return this;
  }

  // customer calls this method if call ended
  // returns promise as customer code should reach 
  // testRTC endpoint and send there its stats
  finish(): Promise<boolean> {
    return false;
  }

}
