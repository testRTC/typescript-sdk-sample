import { IStatsChunk, IUploadStats } from './interfaces/IUpdateStats';
import { Collector } from './sample/collector/Collector';

export class SDK implements IUploadStats {
	private _collector: Collector;
  constructor() {
		// { saveToFile: true } for dev purposes
 		this._collector = new Collector({ saveToFile: true });
	}

  // should be called each second during a call
  // chunk contain stats data per second
  // appendStats can be called like .appendStats({...}).appendStats({...}) with different timestamps
  // or different channels per the second
  appendStats( chunk: IStatsChunk ): SDK {
		// collect some data
		this._collector.push(chunk);

    return this;
  }

	// probably should call sending data to a backend API endpoint
  finish(): boolean {
		// write to a file for now 
		// but later shold be sent to remote api endpoint
    return false;
  }

}
