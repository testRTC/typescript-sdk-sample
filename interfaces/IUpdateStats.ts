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

export interface IUploadStats {
  appendStats( chunk: IStatsChunk ): SDK;
  finish(): Promise<boolean>;
};
