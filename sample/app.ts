import * as request from 'request';
import * as path from 'path';
import { Collector } from './collector/Collector';
import { IStatsChunk, IConnection, IExtra } from '../interfaces/IUpdateStats';

import { SampleGenerator } from './input_samples/sample_generator';
import { SampleReader } from './input_samples/sample_reader';

const filePath: string = path.join(__dirname, '../../sample/', 'input_samples', 'sample.json');
const reader: any = new SampleReader(filePath);

const file: { [prop: string]: IStatsChunk } = reader.read() ; // customizable user input
// file is customer input
// here we should use it and pass into out sdk
const slice = (arrRef, start, end): IStatsChunk => {
	const _listOfAllowedProps: string[] = ['extra', 'stat', 'time'];
	let resultObj: IStatsChunk = {};
	_listOfAllowedProps.forEach( prop => {
		if (prop === 'time' && arrRef) {
			resultObj[prop] = Array.prototype.slice.call(arrRef[prop], start, end);
		}

		if (prop === 'extra' && arrRef) {
			resultObj[prop] = <IExtra>{};
			console.log('arr ref: ', JSON.stringify(arrRef[prop]));
			const listOfProps: string[] = Object.getOwnPropertyNames(arrRef[prop]);
			listOfProps.forEach( _prop => {
				if (Array.isArray( arrRef[prop][_prop] )) {
					Array.prototype.push.apply(resultObj[prop][_prop], arrRef[prop][_prop].slice(start, end));
				} else {
					resultObj[prop][_prop] = arrRef[prop][_prop];
				}
			});
		} else {
			resultObj[prop] = {};
		}

		if (prop === 'stat' && arrRef) {
			console.log('in stat');
			resultObj[prop] = resultObj[prop] || {};

			const listOfProps: string[] = Object.getOwnPropertyNames(arrRef[prop]);
			console.log('allowed list: ', listOfProps);
			listOfProps.forEach( _prop => {
				// console.log(`prop is ${prop}; _prop is ${_prop}; arrRef[prop] = ${arrRef[prop]}`);
				resultObj[prop][_prop] = resultObj[prop][_prop] || <IConnection>{};
				if (Array.isArray( arrRef[prop][_prop] )) {
					console.log(`${_prop} is array`);
					if (!Array.isArray(resultObj[prop][_prop])) {
						resultObj[prop][_prop] = [ arrRef[prop][_prop].slice(start, end) ];
					} else {
						Array.prototype.push.apply(resultObj[prop][_prop], arrRef[prop][_prop].slice(start, end));
					}
				} else {
					console.log(`${_prop} is not an array`);
					// prop stat _prop ConnAudio
					const listOfProps: string[] = Object.getOwnPropertyNames(arrRef[prop][_prop]);
					listOfProps.forEach( __prop => {
						resultObj[prop][_prop][__prop] = resultObj[prop][_prop][__prop] || {};
						// __prop like bytesSent
						if (Array.isArray(arrRef[prop][_prop][__prop])) {
							if (!Array.isArray(resultObj[prop][_prop][__prop])) {
								resultObj[prop][_prop][__prop] = [ arrRef[prop][_prop][__prop].slice(start, end) ];
							} else {
								Array.prototype.push.apply(resultObj[prop][_prop][__prop], arrRef[prop][_prop][__prop].slice(start, end));
							}
						} else {
							resultObj[prop][_prop][__prop] = arrRef[prop][_prop][__prop].slice(start, end);
						}
					});
				}
			});
		}
	});

	return resultObj;
};

const collector: Collector = new Collector({ saveToFile: true });

for (let i = 0; i < 10; i++) { // let's make 10 steps, like 10 seconds
	for (let j = 0; j < Object.getOwnPropertyNames(file).length; j++) {
		// emulate slicing, like customer sends data for each second per call
		const chunkRefs: { [prop: string]: IStatsChunk } = file;
		const currentChunk: IStatsChunk = chunkRefs[`${i}`];
		const perSecondChunk: IStatsChunk = slice(currentChunk, i, i + 1);

		// now pass that chunk to sdk
		collector.push(perSecondChunk);
	}
}

// collector.dropFile();
// collector.dropFile();
