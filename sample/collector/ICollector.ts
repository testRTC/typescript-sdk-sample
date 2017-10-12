'use strict';

import { IStatsChunk } from '../../interfaces/IUpdateStats';

export interface ICollector {

  push(chunk: IStatsChunk): ICollector;
  get(): IStatsChunk[];
  pop(): IStatsChunk | boolean;
}