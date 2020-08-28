import { Component, OnDestroy, OnInit } from '@angular/core';
import { timer } from 'rxjs';
import { take, tap, takeWhile } from 'rxjs/operators';
import { AuthClient } from '../auth/auth-client';
import { SpotifyClient } from '../spotify-client';

@Component({
  selector: 'app-cover',
  templateUrl: './cover.component.html',
  styleUrls: ['./cover.component.css']
})
export class CoverComponent implements OnInit, OnDestroy {
  private _destroy = false;

  public albumUrl = '';

  public constructor(
    private readonly authClient: AuthClient,
    private readonly spotifyClient: SpotifyClient,
  ) { }

  public ngOnInit() {
    timer(0, 3000).pipe(
      takeWhile(() => !this._destroy),
      tap(() => this.doWork()),
    ).subscribe();
  }

  public login() {
    this.authClient.login();
  }

  public ngOnDestroy() {
    this._destroy = true;
  }

  private async doWork() {
    this.spotifyClient.getCurrentlyPlaying().pipe(
      take(1),
    ).subscribe(albumArt => {
      this.albumUrl = albumArt;
    });

  }
}
