import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthClient } from '../auth-client';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-auth-callback',
  templateUrl: './auth-callback.component.html',
  styleUrls: ['./auth-callback.component.css']
})
export class AuthCallbackComponent implements OnInit {

  public constructor(
    private readonly authClient: AuthClient,
    private readonly router: Router,
  ) { }

  public ngOnInit() {
    this.authClient.handleAuthCallback().pipe(
      take(1),
    ).subscribe(() => {
      this.router.navigate(['/cover']);
    });
  }
}
