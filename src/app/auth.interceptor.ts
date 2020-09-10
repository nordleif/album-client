import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthClient } from './auth-client';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  public constructor(
    private readonly authClient: AuthClient,
  ) {

  }

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessToken = this.authClient.accessToken;
    if (accessToken) {
      req = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${accessToken}`)
      });
    }
    return next.handle(req);
  }
}
