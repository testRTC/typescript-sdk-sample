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
    if (this._stack.length) {
      return this._stack.pop();
    } else {
      return false;
    }
  }

  get(): IStatsChunk[] {
    return this._stack;
  }
};