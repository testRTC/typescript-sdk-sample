'use strict';

import { ISender, IResponse } from './ISender';
import { IStatsChunk } from '../../interfaces/IUpdateStats';
import * as request from 'request-promise';

export class Sender implements ISender {
  private _testRunIdUrl: string = '/tests/remote/run'; // { name: name } as body
  private _uploadUrl: string = '/testruns/remote/TEST_RUN_ID/stats'; // data, isLastChunk, sysInfo
  private _testRunName: string = `testRun${Date.now()}`;

  constructor(private _baseUrl: string, private _apiKey: string) {}

  prepareResponse(rawResponse: any): IResponse {
    return rawResponse;
  }

  // /test/remote/run for getting test run id
  // /testruns/remote/testRunId/customer_stats for getting stats from client

  async send(data: IStatsChunk[]): Promise<any> {
    // getting test run id
    let testRunId: any;
    try {
      console.log(`gonna ask: ${this._baseUrl}${this._testRunIdUrl}`);
      testRunId = await request.post({
        uri: `${this._baseUrl}${this._testRunIdUrl}`,
        json: true,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          'apikey': this._apiKey
        },
        body: { name: this._testRunName }
      });
    } catch (err) {
      console.log(`Error getting test run id: ${err}`);
    }
    debugger;

    // TODO: send stats 
    if (testRunId) {
      this._uploadUrl = this._uploadUrl.replace('TEST_RUN_ID', testRunId.testRunId);
      try {
        debugger;
        console.log(`gonna ask: ${this._baseUrl}${this._uploadUrl}`);
        const rawResponse: any = await request.post({
          uri: `${this._baseUrl}${this._uploadUrl}`,
          json: true,
          body: { data: data, isLastChunk: true, sysInfo: {} },
          headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'apikey': this._apiKey
          }
        });
        debugger;
      } catch (err) {
        console.log(`Error sending data to server: ${err}`);
      }

    } else {
      console.log(`No test run id received`);
    }

    debugger;
    return new Promise( (resolve, reject) => {
      return resolve({});
    });
  }
}
