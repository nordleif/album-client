import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

const AUTH_ACCESS_TOKEN = 'album_auth_access_token';
const AUTH_REDIRECT_URL = 'album_auth_redirect_uri';
const AUTH_REFRESH_TOKEN = 'album_auth_refresh_token';
const AUTH_STATE = 'album_auth_state';

@Injectable({
  providedIn: 'root'
})
export class AuthClient {

  private _accessToken: string;
  private _refreshToken: string;
  private readonly _scopes = 'user-read-currently-playing playlist-read-private user-top-read user-read-recently-played';

  public constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly httpClient: HttpClient,
    private readonly location: Location,
  ) {
    this._accessToken = localStorage.getItem(AUTH_ACCESS_TOKEN);
    this._refreshToken = localStorage.getItem(AUTH_REFRESH_TOKEN);
  }

  public get accessToken() {
    return this._accessToken;
  }

  public login() {
    const state = this.generateRandomString();
    localStorage.setItem(AUTH_STATE, state);

    const redirectUri = document.location.origin + this.location.prepareExternalUrl('auth/callback');
    localStorage.setItem(AUTH_REDIRECT_URL, redirectUri);

    let url = 'https://accounts.spotify.com/authorize';
    url += `?client_id=${environment.clientId}`;
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

    const state = localStorage.getItem(AUTH_STATE);
    localStorage.removeItem(AUTH_STATE);
    if (!state) {
      throw new Error('state cannot be null.');
    }

    const redirectUri = localStorage.getItem(AUTH_REDIRECT_URL);
    localStorage.removeItem(AUTH_REDIRECT_URL);
    if (!redirectUri) {
      throw new Error('redirectUrl cannot be null.');
    }

    if (state !== responseState) {
      throw new Error('Invalid State');
    }

    const url = `${environment.url}/api/token`;
    const body = {
      grant_type: 'authorization_code',
      code: responseCode,
      redirect_uri: redirectUri,
    };

    return this.httpClient.post<any>(url, body).pipe(
      tap((res: any) => {
        const error = res.error;
        if (error) {
          const description = res.error_description;
          throw new Error(`${error}: ${description}`);
        }
      }),
      tap((res: any) => {
        this._accessToken = res.access_token;
        this._refreshToken = res.refresh_token;
        localStorage.setItem(AUTH_ACCESS_TOKEN, this._accessToken);
        localStorage.setItem(AUTH_REFRESH_TOKEN, this._refreshToken);
      }),
    );
  }

  public refreshToken() {
    const refreshToken = localStorage.getItem(AUTH_REFRESH_TOKEN);
    if (!refreshToken) {
      throw new Error('refreshToken cannot be null.');
    }

    const url = `${environment.url}/api/token`;
    const body = {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    };

    return this.httpClient.post<any>(url, body).pipe(
      tap((res: any) => {
        const error = res.error;
        if (error) {
          const description = res.error_description;
          throw new Error(`${error}: ${description}`);
        }
      }),
      tap((res: any) => {
        this._accessToken = res.access_token;
        localStorage.setItem(AUTH_ACCESS_TOKEN, this._accessToken);
      }),
    );
  }

  private generateRandomString() {
    const array = new Uint32Array(28);
    window.crypto.getRandomValues(array);
    return Array.from(array, dec => ('0' + dec.toString(16)).substr(-2)).join('');
  }
}
