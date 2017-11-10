'use strict';

import { ISender } from './ISender';
import { IStatsChunk } from '../../interfaces/IUpdateStats';
import * as request from 'request-promise';

// simple implementation of sernder module 
// which simple sends data via http
export class Sender implements ISender {
  private _testRunIdUrl: string = '/tests/remote/run';
  private _uploadUrl: string = '/testruns/remote/TEST_RUN_ID/stats';
  private _baseUrl: string ='https://api.testrtc.com/v1s2';

  constructor(private _apiKey: string) {}

  // /test/remote/run for getting test run id
  // /testruns/remote/testRunId/customer_stats for getting stats from client

  async send(data: IStatsChunk[], testRunId: string): Promise<boolean> {
    // sending collected stats
    if (testRunId) {
      this._uploadUrl = this._uploadUrl.replace('TEST_RUN_ID', testRunId);
      try {
        console.log(`Sending collected stats: ${this._baseUrl}${this._uploadUrl}`);
        const rawResponse: any = await request.post({
          uri: `${this._baseUrl}${this._uploadUrl}`,
          json: true,
          body: { data: data, isLastChunk: true, sysInfo: {
            OS: 'Linux', // stub data
            browserName: 'SDK', // stub data
            browserVersion: '0.0.1' // stub data
          } },
          headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'apikey': this._apiKey
          }
        });
        return Promise.resolve(true);
      } catch (err) {
        console.log(`Error sending data to server: ${err}`);
        return Promise.reject(false);
      }

    } else {
      console.log(`No test run id received`);
    }
  }
}
