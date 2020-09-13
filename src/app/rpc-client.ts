import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { JsonRpcRequest } from './json-rpc';

@Injectable({
  providedIn: 'root'
})
export class RpcClient {
  public constructor(
    private readonly httpClient: HttpClient,
  ) { }

  public screenOff() {
    const url = `${environment.url}/api/rpc`;
    const request: JsonRpcRequest = { jsonrpc: '2.0', method: 'screenOff', params: {}, id: 1 };
    return this.httpClient.post(url, request);
  }

  public screenOn() {
    const url = `${environment.url}/api/rpc`;
    const request: JsonRpcRequest = { jsonrpc: '2.0', method: 'screenOn', params: {}, id: 1 };
    return this.httpClient.post(url, request);
  }
}
