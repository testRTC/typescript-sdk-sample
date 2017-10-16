import { ITestRTCStats } from './ITestRTCStats';
import { SDK } from '../sdk';

export interface IExtra {
	localDescription: {
		sdp: string;
		type: string;
	};
	remoteDescription: {
		sdp: string;
		type: string;
	}
};

export interface IConnection {
	bytesRecieved: any[]; // [null, "number"]
	bytesSent: any[]; // [null, "number"]
	consentRequestsSent: string; // "1"
	googActiveConnection: string; // "true" or "false"
	googChannelId: string; // "Channel-audio-1"
	googLocalAddress: any[]; // "172.17.0.3:36776" or null
	googLocalCandidateType: string; // "local"
	googRtt: any[]; // "number" or null
	googTransportType: string; // "udp"
	googWritable: string; // "true" or "false"
	id: string; // "Channel-audio-1"
	localCandidateId: any[]; // like "Cand-ntBJ1Ijp"
	packetsDiscardedOnSend: string; // "0"
	packetsSent: any[]; // "string" or null
	remoteCandidateId: any[]; // like "Cand-StD1OFRx" or null
	requestsReceived: any[]; // "number" or null
	requestSent: any[]; // "number" or null
	responsesRecieved: any[]; // "number" or null
	responsesSent: any[]; // "number" or null
	timestamp: any[]; // "string" or null
	type: string; // "googCandidatePair"
}

interface IStat {
	[channelName: string]: IConnection;
};

interface ITime {
	channels: string[]; // like "ssrc_1948310164_send"
	timestamp: number; // ms
}

export interface IStatsChunk{
	channelId: string; // "0"
	client: string; // "wbekit" by default
	extra: IExtra;
	stat: IStat;
	time: ITime[];
};

export interface IStatsChunkOLD {
  timestamp: string;
  channelName: string;
  bytes: number;
  jitter: number;
  rtt: number;
  loss: number;
  media: string; // audio | video
  direction: string; // send | recv
  videoResolution?: string;
  videoFrameRate?: number;
}

export interface IUploadStats {
  appendStats( chunk: IStatsChunk ): SDK;
  finish(): boolean;
};
