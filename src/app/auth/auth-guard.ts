import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChild, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivateChild {
  public constructor() { }

  public canActivateChild(route: ActivatedRouteSnapshot, routerState: RouterStateSnapshot) {
    return true;
  }
}
