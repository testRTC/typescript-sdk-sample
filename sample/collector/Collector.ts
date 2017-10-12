import { ICollector } from './ICollector';
import { IStatsChunk } from '../../interfaces/IUpdateStats';

export class Collector implements ICollector {
  private _stack: IStatsChunk[] = [];

  constructor() {  }

  push(chunk: IStatsChunk): ICollector{
    this._stack.push(chunk);
    return <ICollector>this;
  }

  pop(): IStatsChunk | boolean {
    return this._stack.pop() || false;
  }

  get(): IStatsChunk[] {
    return this._stack;
  }
};