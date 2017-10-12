'use strict';

interface IResponse {
  status: string,
  message: string;
}

interface ISender {
  get(): void; // get
  send(url: string, body: any): IResponse; // post
}