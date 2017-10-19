import * as request from 'request';
import * as path from 'path';
import { Collector } from './collector/Collector';
import { IStatsChunk, IConnection, IExtra } from '../interfaces/IUpdateStats';
import { Sender } from './sender/Sender';

import { SampleGenerator } from './input_samples/sample_generator';
import { SampleReader } from './input_samples/sample_reader';

const filePath: string = path.join(__dirname, '../../sample/', 'input_samples', 'sample.json');
const reader: any = new SampleReader(filePath);

const file: { [prop: string]: IStatsChunk } = reader.read() ; // customizable user input
// file is customer input
// here we should use it and pass into our sdk
const slice = (arrRef, start, end): IStatsChunk => {
	const _listOfAllowedProps: string[] = ['extra', 'stat', 'time'];
	let resultObj: IStatsChunk = <IStatsChunk>{};
	_listOfAllowedProps.forEach( prop => {
		if (prop === 'time' && arrRef) {
			resultObj[prop] = Array.prototype.slice.call(arrRef[prop], start, end);
		}

		if (prop === 'extra' && arrRef) {
			resultObj[prop] = <IExtra>{};
			const listOfProps: string[] = Object.getOwnPropertyNames(arrRef[prop]);
			listOfProps.forEach( _prop => {
				if (Array.isArray( arrRef[prop][_prop] )) {
					Array.prototype.push.apply(resultObj[prop][_prop], arrRef[prop][_prop].slice(start, end));
				} else {
					resultObj[prop][_prop] = arrRef[prop][_prop];
				}
			});
		} 

		if (prop === 'stat' && arrRef) {
			resultObj[prop] = resultObj[prop] || {};

			const listOfProps: string[] = Object.getOwnPropertyNames(arrRef[prop]);
			listOfProps.forEach( _prop => {
				// console.log(`prop is ${prop}; _prop is ${_prop}; arrRef[prop] = ${arrRef[prop]}`);
				resultObj[prop][_prop] = resultObj[prop][_prop] || <IConnection>{};
				if (Array.isArray( arrRef[prop][_prop] )) {
					if (!Array.isArray(resultObj[prop][_prop])) {
						resultObj[prop][_prop] = arrRef[prop][_prop].slice(start, end);
					} else {
						Array.prototype.push.apply(resultObj[prop][_prop], arrRef[prop][_prop].slice(start, end));
					}
				} else {
					// prop stat _prop ConnAudio
					const listOfProps: string[] = Object.getOwnPropertyNames(arrRef[prop][_prop]);
					listOfProps.forEach( __prop => {
						resultObj[prop][_prop][__prop] = resultObj[prop][_prop][__prop] || {};
						// __prop like bytesSent
						if (Array.isArray(arrRef[prop][_prop][__prop])) {
							if (!Array.isArray(resultObj[prop][_prop][__prop])) {
								resultObj[prop][_prop][__prop] = arrRef[prop][_prop][__prop].slice(start, end);
							} else {
								Array.prototype.push.apply(resultObj[prop][_prop][__prop], arrRef[prop][_prop][__prop].slice(start, end));
							}
						} else {
							resultObj[prop][_prop][__prop] = arrRef[prop][_prop][__prop];
						}
					});
				}
			});
		}
	});

	return resultObj;
};

const collector: Collector = new Collector({ saveToFile: true });

for (const connId of Object.getOwnPropertyNames(file)) {
  const currentChunk: IStatsChunk = file[connId];
  for (let i = 0; i < 10; i++) {
		let perSecondChunk: IStatsChunk = slice(currentChunk, i, i + 1);
    perSecondChunk = Object.assign({}, perSecondChunk, { connId });
    collector.push(perSecondChunk);
  }

}

collector.readFromFile().then(
  res => {

    // Send data to remote server
    const sender = new Sender('https://api.testrtc.com/v1s2', '53218617-d178-4511-abc2-a3d5db02107f');
    sender.send(res);
    console.log(`Done`);
  }
);
