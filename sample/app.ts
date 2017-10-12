import * as request from 'request';
import { Collector } from './collector/Collector';
import { IStatsChunk } from '../interfaces/IUpdateStats';

import { SampleGenerator } from './input_samples/sample_generator';

const collector = new Collector();
const sg = new SampleGenerator();
const sample: IStatsChunk[] = sg.generate(10);

for (let i = 0; i < sample.length; i++) {
  collector.push(sample[i]);
}

const results: IStatsChunk[] = collector.get();