import { Component, OnDestroy, OnInit } from '@angular/core';
import { timer } from 'rxjs';
import { switchMap, take, takeWhile, tap } from 'rxjs/operators';
import { PyClient } from '../py-client';
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
    private readonly pyClient: PyClient,
    private readonly spotifyClient: SpotifyClient,
  ) { }

  public ngOnInit() {
    timer(0, 3000).pipe(
      takeWhile(() => !this._destroy),
    ).subscribe(() => {
      this.doWork();
    });
  }

  public ngOnDestroy() {
    this._destroy = true;
  }

  private async doWork() {
    this.spotifyClient.getCurrentlyPlaying().pipe(
      take(1),
      tap(albumUrl => this.albumUrl = albumUrl),
      switchMap(albumUrl => albumUrl ? this.pyClient.screenOn() : this.pyClient.screenOff()),
    ).subscribe();
  }
}
