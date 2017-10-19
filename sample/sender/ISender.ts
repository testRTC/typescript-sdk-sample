'use strict';

export interface ISender {
  send(body: any): Promise<any>;
}
