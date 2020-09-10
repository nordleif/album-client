import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChild, RouterStateSnapshot, Router } from '@angular/router';
import { AuthClient } from './auth-client';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivateChild {
  public constructor(
    private readonly authClient: AuthClient,
    private readonly router: Router,
  ) { }

  public canActivateChild(route: ActivatedRouteSnapshot, routerState: RouterStateSnapshot) {
    if (this.authClient.accessToken) {
      return true;
    } else {
      this.router.navigate(['/auth/login']);
      return false;
    }
  }
}
