import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { JsonRpcError } from './json-rpc';

@Injectable()
export class JsonRpcInterceptor implements HttpInterceptor {
  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      switchMap(event => {
        let err: JsonRpcError;
        if (event instanceof HttpResponse && !Array.isArray(event.body) && typeof event.body === 'object') {
          if (event.body && 'jsonrpc' in event.body && event.body.jsonrpc === '2.0' && 'error' in event.body) {
            err = event.body.error;
          }
        }
        if (err) {
          return throwError(err);
        } else {
          return of(event);
        }
      }),
    );
  }
}
