import * as fs from 'fs';
import { IStatsChunk } from '../../interfaces/IUpdateStats';

export class SampleReader {
	private _filePath: string;

	constructor( filePath: string ) {
		if (filePath) {
			this._filePath = filePath;
		} else {
			throw new Error('No file path passed');
		}
	}

	 read(): { [prop: string]: IStatsChunk } {
		try {
			const _file: any = fs.readFileSync(this._filePath);
			return JSON.parse(_file);
		} catch (err) {
			console.log(`Error while reading: ${err}`);
		}
	}

}
