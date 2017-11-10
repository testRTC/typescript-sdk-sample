import { SDK } from '../sdk';

// IConnection contains optional props. Their mandatory depends on type of channel
// either it's video or audio
export interface IConnection {
  googCodecName: string;
  packetsSent: number[];
  packetsReceived: number[];
  bytesSent: number[];
	bytesReceived: number[];
  packetsLost: number;
  googRtt: number[];
  googJitterReceived: number[];

  googFrameWidthSend?: number[];
  googFrameHeightSent?: number[];
  googFrameRateSent?: number[];
  googFrameWidthReceived?: number[];
  googFrameHeightReceived?: number[];
  googFrameRateReceived?: number[];
}

interface IStat {
	[channelName: string]: IConnection; // like "ssrc_1948310164_send"
};

interface ITime {
	channels: string[]; // like "ssrc_1948310164_send"
	timestamp: number; // ms
}

export interface IStatsChunk {
	channelId: string; // like "0"
	client: string; // "webkit" by default
	stat: IStat;
	time: ITime[];
};

// SDK interface, should be impleneted by customer
export interface ITestRTCSDK {
  init( apiKey: string ): ITestRTCSDK;
  append( // remember to use client: 'webkit' by default
    connId: number, // old channelId title
    channelName: string,
    timestamp: number, // should be passed by customer because can be delay in ts

    googCodecName: string,
    packetsSent: number[],
    packetsReceived: number[],
    bytesSent: number[],
    bytesReceived: number[],
    packetsLost: number,
    googRtt: number[],
    googJitterReceived: number[],

    googFrameWidthSend?: number,
    googFrameHeightSent?: number,
    googFrameRateSent?: number,
    googFrameWidthReceived?: number,
    googFrameHeightReceived?: number,
    googFrameRateReceived?: number
  ): ITestRTCSDK;
  finish(): Promise<boolean>;
}

export interface IUploadStats {
  appendStats( chunk: IStatsChunk ): SDK;
  finish(): Promise<boolean>;
};
