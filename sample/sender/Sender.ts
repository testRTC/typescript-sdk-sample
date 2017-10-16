'use strict';

import { ISender, IResponse } from './ISender';
import { IStatsChunk } from '../../interfaces/IUpdateStats';
import * as request from 'request-promise';

export class Sender implements ISender {
  constructor() {}

  prepareResponse(rawResponse: any): IResponse {
    return rawResponse;
  }

  // /test/remote/run for getting test run id
  // /testruns/remote/testRunId/customer_stats for getting stats from client

  send(uri: string, body: IStatsChunk[]): Promise<IResponse> {
    const config = { uri: uri, method: 'POST', body: body, json: true };
		
		
    // TODO: get testRunId
    

    // TODO: send stats 

    try {
      const rawResponse: any = request.post(config);
      return this.prepareResponse(rawResponse);
    } catch (err) {
      console.log(err);
    }
  }
}
