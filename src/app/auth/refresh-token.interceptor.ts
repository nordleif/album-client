import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthClient } from './auth-client';

@Injectable()
export class RefreshTokenInterceptor implements HttpInterceptor {
  public constructor(
    private readonly authClient: AuthClient,
  ) { }

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req);
    return next.handle(req).pipe(
      catchError(err =>  err.status === 401
        ? this.authClient.refreshToken().pipe(switchMap(() => next.handle(req)))
        : throwError(err)
      ),
    );
  }
}
