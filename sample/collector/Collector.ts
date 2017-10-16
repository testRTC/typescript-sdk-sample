import { ICollector } from './ICollector';
import { IStatsChunk } from '../../interfaces/IUpdateStats';
import * as fs from 'fs';
import * as path from 'path';

export class Collector implements ICollector {
  private _stack: IStatsChunk[] = [];
	private _filePath: string = path.join(__dirname, 'statsFile');
	private _opts: any = {};

  constructor( opts?: any ) {
		this._opts = opts || {};
	}

  push(chunk: IStatsChunk): ICollector{
    this._stack.push(chunk);

		// save to file for test if needed
		if (this._opts && this._opts.saveToFile) {
			this.dropToFile();
			console.log('Dropped to file ', this._filePath);
		}

    return <ICollector>this;
  }

  pop(): IStatsChunk | boolean {
    return this._stack.pop() || false;
  }

  get(): IStatsChunk[] {
    return this._stack;
  }

	private dropToFile(): boolean {
		try {
			const _chunk: any = `${JSON.stringify(this.get())}\n`;
			fs.appendFileSync(this._filePath, _chunk);
		} catch (err) {
			console.log(`Writing file exception: ${err}`);
			return false;
		}

		return true;
	}

	dropFile(): boolean {
		try {
			const deleted = fs.unlinkSync(this._filePath);
			console.log(`file ${this._filePath} dropped`);
		} catch (err) {
			console.log(`Writing file exception: ${err}`);
			return false;
		}

		return true;
	}
};
