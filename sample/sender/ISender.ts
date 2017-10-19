'use strict';

export interface IResponse {
  status: string,
  message: string;
}

export interface ISender {
  send(body: any): Promise<IResponse>;
	prepareResponse(rawResponse: any): IResponse;
}
