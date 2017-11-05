import * as path from 'path';
import { IStatsChunk, IConnection, IExtra } from '../interfaces/IUpdateStats';
import { Sender } from './sender/Sender';

import { SampleReader } from './input_samples/sample_reader';

// get a file - what customer collected on his side
const filePath: string = path.join(__dirname, '../../sample/', 'input_samples', 'sample.json');
const reader: any = new SampleReader(filePath);
const customerInput: { [prop: string]: IStatsChunk } = reader.read();

//sending customer input to testRTC endpoint
const sender = new Sender('https://api.testrtc.com/v1s2', '9cf7609d-3e20-46d8-b0d5-4d7a5da2424b');
sender
  .send(customerInput)
  .then( res => {
    console.log(`Done`);
  });
