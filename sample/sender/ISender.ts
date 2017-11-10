'use strict';

export interface ISender {
  send(body: any, testRunId: string): Promise<boolean>;
}
