'use strict';

export interface IResponse {
  status: string,
  message: string;
}

export interface ISender {
  send(url: string, body: any): Promise<IResponse>;
	prepareResponse(rawResponse: any): IResponse;
}
