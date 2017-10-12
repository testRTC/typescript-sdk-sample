'use strict';
import { IStatsChunk } from '../../interfaces/IUpdateStats';

class SampleGenerator {
  private _samples: IStatsChunk[] = [];

  constructor() {}

  generate(count: number): IStatsChunk[] {
    const _count: number = count ? count : 10;
    const media: string[] = ['audio', 'video'];
    const direction: string[] = ['send', 'recv'];

    const rand = (min: number, max: number) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };


    for (let i = 0; i < _count; i++) {
      const chunk: IStatsChunk = {
        timestamp: Date.now().toString(),
        channelName: 'ssrc_something_1',
        bytes: 4,
        jitter: 5,
        rtt: 3,
        loss: 1,
        media: media[rand(0, 1)],
        direction: direction[rand(0, 1)]
      };

      this._samples.push(chunk);
    }

    return this._samples;
  }
}