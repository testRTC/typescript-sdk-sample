import { IStatsChunk, IUploadStats } from './interfaces/IUpdateStats';
import { Collector } from './sample/collector/Collector';
import {} from './'

// INFO: sample for customer how he/she should interact with testRTC SDK
export class SDK implements IUploadStats {
  private _testRunIdUrl: string = '/tests/remote/run'; 
  private _uploadUrl: string = '/testruns/remote/TEST_RUN_ID/stats';
  private _testRunName: string = `customerTestRunName`;

  constructor(_apiKey: string) {
    this.getTestRunId();
  }

  // calling testRTC api and getting test run id
  private getTestRunId(): Promise<{ testRunId: string }> {
  }

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
  // uses private props to form proper url and end there stats
  finish(): Promise<boolean> {
    return false;
  }

}
