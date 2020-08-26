import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Guid } from '../guid';
import { JsonRpcRequest, JsonRpcResponse } from '../json-rpc';


@Injectable({
  providedIn: 'root'
})
export class AuthClient {
  private _accessToken: string;
  private readonly _clientId = '2914b90321254148b57f41438e31d7b3';
  private _refreshToken: string;
  private readonly _scopes = 'user-read-currently-playing playlist-read-private user-top-read user-read-recently-played';

  public constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly httpClient: HttpClient,
  ) {
    this._accessToken = localStorage.getItem('album_auth_access_token');
    this._refreshToken = localStorage.getItem('album_auth_refresh_token');
  }

  public get accessToken() {
    return this._accessToken;
  }

  public login() {
    const state = this.generateRandomString();
    const redirectUri = 'http://localhost:4200/auth/callback';

    localStorage.setItem('album_auth_state', state);
    localStorage.setItem('album_auth_redirect_uri', redirectUri);

    let url = 'https://accounts.spotify.com/authorize';
    url += `?client_id=${this._clientId}`;
    url += '&response_type=code';
    url += `&redirect_uri=${encodeURIComponent(redirectUri)}`;
    url += `&state=${state}`;
    url += `&scope=${encodeURIComponent(this._scopes)}`;

    window.location.href = url;
  }

  public handleAuthCallback() {

    const responseCode = this.activatedRoute.snapshot.queryParams.code;
    if (!responseCode) {
      throw new Error('queryCode cannot be null');
    }

    const responseState = this.activatedRoute.snapshot.queryParams.state;
    if (!responseState) {
      throw new Error('queryState cannot be null.');
    }

    const state = localStorage.getItem('album_auth_state');
    localStorage.removeItem('album_auth_state');
    if (!state) {
      throw new Error('state cannot be null.');
    }

    const redirectUri = localStorage.getItem('album_auth_redirect_uri');
    localStorage.removeItem('album_auth_redirect_uri');
    if (!redirectUri) {
      throw new Error('redirectUrl cannot be null.');
    }

    if (state !== responseState) {
      throw new Error('Invalid State');
    }

    const url = `${environment.url}/api/token`;
    const request: JsonRpcRequest = {
      jsonrpc: '2.0',
      method: 'requestAccessToken',
      params: {
        code: responseCode,
        redirectUri,
      },
      id: Guid.newGuid()
    };

    return this.httpClient.post<JsonRpcResponse>(url, request).pipe(
      map(r => r.result),
      tap(r => {
        this._accessToken = r.access_token;
        this._refreshToken = r.refresh_token;
        localStorage.setItem('album_auth_access_token', this._accessToken);
        localStorage.setItem('album_auth_refresh_token', this._refreshToken);
      }),
    );
  }

  private generateRandomString() {
    const array = new Uint32Array(28);
    window.crypto.getRandomValues(array);
    return Array.from(array, dec => ('0' + dec.toString(16)).substr(-2)).join('');
  }
}
