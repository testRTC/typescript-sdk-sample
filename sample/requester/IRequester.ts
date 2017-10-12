'use strict';

interface IResponse {
  status: string,
  message: string;
}

interface IRequester {
  (): void; // get
  (url: string, body: any): IResponse; // post
}