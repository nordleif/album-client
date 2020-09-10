import { Component, OnInit } from '@angular/core';
import { AuthClient } from '../auth-client';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private readonly authClient: AuthClient,
  ) { }

  public ngOnInit() {
    this.authClient.login();
  }
}
