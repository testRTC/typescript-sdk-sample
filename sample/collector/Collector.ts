import { ICollector } from './ICollector';
import { IStatsChunk } from '../../interfaces/IUpdateStats';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

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
      const data: IStatsChunk[] = this._stack.slice();
			const _chunk: any = `${JSON.stringify(data[data.length - 1])}\n`;
			fs.appendFileSync(this._filePath, _chunk);
		} catch (err) {
			console.log(`Writing file exception: ${err}`);
			return false;
		}

		return true;
	}

  async readFromFile( filePath: string = this._filePath): Promise<any> {
    let lines: any;
    let readStream: fs.ReadStream;

    if (!filePath) {
      throw new Error(`No file path has been passed into readFromFile`);
    }

    try {
      readStream = fs.createReadStream(filePath);
    } catch (err) {
      console.log(`Error creating read stream to ${filePath}: ${err}`);
    }

    try {
      lines = readline.createInterface({ input: readStream });
    } catch (err) {
      console.log(`Error reading line from file: ${err}`);
    }

    return new Promise( (resolve, reject) => {
      const _base: any = <IStatsChunk>{};
      lines
        .on('line', async line => {
          const parsedLine: IStatsChunk = JSON.parse(line);
          // here should be function which creates object for sending
          this.processCollectedData(_base, parsedLine);
        })
        .on('close', () => {
          resolve(_base);
        });
    });

  }

  private processCollectedData(base: any, chunk: any): void {
    const merge = (base: IStatsChunk, chunk: IStatsChunk): void => {
      for (let prop of Object.getOwnPropertyNames(chunk)) {
        for (let _prop of Object.getOwnPropertyNames(chunk[prop])) {
          if (!Object.prototype.hasOwnProperty.call(base, prop)) { // new prop
            base[prop] = chunk[prop];
          } else { // merge prop content with base
            if (!Object.prototype.hasOwnProperty.call(base[prop], _prop)) {
              base[prop][_prop] = chunk[prop][_prop];
            } else {
              if (Array.isArray(chunk[prop][_prop])) {
                Array.prototype.push.apply(base[prop][_prop], chunk[prop][_prop]);
              } else {
                // seems like we do not have non array props for merging
                // above we assign new props, those shouldn't be changed
              }
            }
          }
        }
      }
    };

    if (!(chunk.connId in base)) {
      base[chunk.connId] = {
        channelId: chunk.connId,
        extra: {},
        stat: {},
        time: []
      };
    }

    ['extra', 'stat'].forEach( prop => {
      merge(base[chunk.connId][prop], chunk[prop]);
    });

    merge(base[chunk.connId]['time'], chunk['time']);
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
