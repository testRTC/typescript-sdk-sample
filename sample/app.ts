import * as path from 'path';
import { IStatsChunk, IConnection, ITestRTCSDK } from '../interfaces/IUpdateStats';
import { Sender } from './sender/Sender';
import * as rp from 'request-promise';

import { SampleReader } from './input_samples/sample_reader';

// get a file - what customer collected on his side
const filePath: string = path.join(__dirname, '../../sample/', 'input_samples', 'sample.json');
const reader: any = new SampleReader(filePath);
const customerInput: IStatsChunk[] = reader.read();

// implement SDK
class APP implements ITestRTCSDK {
  private _cache: any = {};

  private _apiKey: string;
  private _testRunId: string;
  private _baseUrl: string ='https://api.testrtc.com/v1s2';
  private _testRunIdUrl: string = '/tests/remote/run'; // { name: name } as body
  private _testRunName: string = `testRun${Date.now()}`;

  constructor() {}

  init( apiKey: string ): APP  {
    if (!apiKey) {
      throw new Error(`No api key provided`);
    }

    this._apiKey = apiKey;

    // async operation, we don't need testRunId right now
    this.getTestRunId();
    return this;
  }

  // ask api to run a test and return an ID
  private async getTestRunId() {
    if (!this._apiKey) {
      throw new Error(`No api key. Please use .init first`);
    }

    try {
      console.log(`Asking for test run id: ${this._baseUrl}${this._testRunIdUrl}`);

      const res = await rp.post({
        uri: `${this._baseUrl}${this._testRunIdUrl}`,
        json: true,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          'apikey': this._apiKey
        },
        body: { name: this._testRunName }
      });
      this._testRunId = res.testRunId;
      console.log(`test run id is ${this._testRunId}`);
    } catch (err) {
      throw new Error(`Error getting test run id: ${err}`);
    }

  }

  append(
    connId: number, // old channelId title
    channelName: string,
    timestamp: number, // should be passed by customer because can be delay in ts

    googCodecName: string,
    packetsSent: number,
    packetsReceived: number,
    bytesSent: number,
    bytesReceived: number,
    packetsLost: number,
    googRtt: number,
    googJitterReceived: number,

    googFrameWidthSend?: number,
    googFrameHeightSent?: number,
    googFrameRateSent?: number,
    googFrameWidthReceived?: number,
    googFrameHeightReceived?: number,
    googFrameRateReceived?: number
  ): APP {
    // implement collecting data each second

    if (!this._cache[connId]) {
      this._cache[connId] = {
        // probably confising, but connId it's channelId
        // by old design channelId in stats has name channelId
        channelId: connId,
        time: [],
        stat: {},
        client: 'webkit'
      };
    }

    const ref = this._cache[connId];

    // channelId required by backend
    ref.channelId = connId;

    // pushing time object 
    // we use list of channels and timestamp where it was used
    if (ref.time.filter( time => time.timestamp === timestamp ).length > 0) {
      ref.time.forEach( time => {
        if (time.timestamp === timestamp) {
          time.channels.push(channelName);
        }
      });
    } else {
      ref.time.push({
        timestamp,
        channels: [ channelName ]
      });
    }

    //pushing channel data
    if (ref.stat[channelName]) {
      ref.stat[channelName].googCodecName = googCodecName;
      ref.stat[channelName].packetsSent.push(packetsSent);
      ref.stat[channelName].packetsReceived.push(packetsReceived);
      ref.stat[channelName].bytesSent.push(bytesSent);
      ref.stat[channelName].bytesReceived.push(bytesReceived);
      ref.stat[channelName].packetsLost = packetsLost;
      ref.stat[channelName].googRtt.push(googRtt);
      ref.stat[channelName].googJitterReceived.push(googJitterReceived);

      // optional, relates to video channels
      if (googFrameWidthSend) {
        ref.stat[channelName].googFrameWidthSend.push(googFrameWidthSend);
      }
      
      if (googFrameHeightSent) {
        ref.stat[channelName].googFrameHeightSent.push(googFrameHeightSent);
      }

      if (googFrameRateSent) {
        ref.stat[channelName].googFrameRateSent.push(googFrameRateSent);
      }

      if (googFrameRateReceived) {
        ref.stat[channelName].googFrameRateReceived.push(googFrameRateReceived);
      }

      if (googFrameWidthReceived) {
        ref.stat[channelName].googFrameWidthReceived.push(googFrameWidthReceived);
      }

      if (googFrameHeightReceived) {
        ref.stat[channelName].googFrameHeightReceived.push(googFrameHeightReceived);
      }

    } else {
      ref.stat[channelName] = {
        googCodecName,
        packetsSent: [ packetsSent ],
        packetsReceived: [ packetsReceived ],
        bytesSent: [ bytesSent ],
        bytesReceived: [ bytesReceived ],
        packetsLost,
        googRtt: [ googRtt ],
        googJitterReceived: [ googJitterReceived ]
      };

      if (googFrameWidthSend) {
        ref.stat[channelName].googFrameWidthSend = [ googFrameWidthSend ];
      }
      
      if (googFrameHeightSent) {
        ref.stat[channelName].googFrameHeightSent = [ googFrameHeightSent ];
      }

      if (googFrameRateSent) {
        ref.stat[channelName].googFrameRateSent = [ googFrameRateSent ];
      }

      if (googFrameRateReceived) {
        ref.stat[channelName].googFrameRateReceived = [ googFrameRateReceived ] ;
      }

      if (googFrameWidthReceived) {
        ref.stat[channelName].googFrameWidthReceived = [ googFrameWidthReceived ];
      }

      if (googFrameHeightReceived) {
        ref.stat[channelName].googFrameHeightReceived = [ googFrameHeightReceived ];
      }

    }

    return this;
  }

  // uses internal cache (data we collected from .getStat)
  // and sends it to testRTC API endpoint
  finish(): Promise<boolean> {
    const sender = new Sender(this._apiKey);
    return sender.send( this._cache, this._testRunId );    
  }
}

// simple customer application
const app = new APP();
// customer gets an API key from support
// or from dashboard (home page)
// but this feature shold be activated by support
app.init('9cf7609d-3e20-46d8-b0d5-4d7a5da2424b');

// emulating sending data from webrtc .getStat fn
// timeout because need to wait a bit to get testRunID
// in real life cases you don't get results immediately
setTimeout( () => {
  // emulating 20 seconds of audio call
  for (let i = 0; i < 20; i++) {
    const collected = {
      connId: 0,
      channelName: 'ssrc_123123_send',
      timestamp: (new Date()).getTime() + (i * 1000), // increase seconds

      // all props should be accomodated
      // f.g. 1st sample is 20 packets
      // 2nd is 40 packets, then 2snd actually
      // got also 20 packets because 40 - prev sample
      // 40 - 20 = 20
      googCodecName: 'opus',
      packetsSent: (i * 40) * 2,
      packetsReceived: (i * 20) * 2,
      bytesSent: (i * 6) * 2,
      bytesReceived: ( i * 7 ) * 2,
      packetsLost: ( i * 1 ) * 2,
      googRtt: ( 20 * 2 ) * 2,
      googJitterReceived:(  i * 12) * 2
      
      // uncomment if you want to send video channels
      // googFrameWidthSend?: number,
      // googFrameHeightSent?: number,
      // googFrameRateSent?: number,
      // googFrameWidthReceived?: number,
      // googFrameHeightReceived?: number,
      // googFrameRateReceived?: number
    };

    // storing data into internal cache
    // and gonna send it in the end of a call
    app.append(
      collected.connId,
      collected.channelName,
      collected.timestamp,
      collected.googCodecName,
      collected.packetsSent,
      collected.packetsReceived,
      collected.bytesSent,
      collected.bytesReceived,
      collected.packetsLost,
      collected.googRtt,
      collected.googJitterReceived
    );

  }

  // sending data to testRTC API endpoint
  app.finish().then(
    success => {
      console.log(`that is ok`);
    },
    error => {
      console.log(`that is not ok`);
    }
  );
}, 5000);

