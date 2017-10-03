interface IDeviceResolution {
  max: number;
  min: number;
}

interface IDevice {
  advanced: {
    width: IDeviceResolution;
    height: IDeviceResolution;
    frameRate?: IDeviceResolution;
    [propName: string]: any;
  }
}

interface IGetUserMedia {
  audio: IDevice;
  origin?: string;
  video: IDevice;
}

interface IStats {
  [channelName: string]: {
    startTime: Date;
    endTime: Date;
    values: string[];
  }
}

interface IPeerConnectionDescription {
  constraints?: any;
  rtcConfiguration?: any;
  stats: IStats;
}

interface IPeerConnections {
  [connNumber: string]: IPeerConnectionDescription;
}

export interface ITestRTCStats {
  getUserMedia: IGetUserMedia[];
  PeerConnections: IPeerConnections;
  UserAgent?: string;
}