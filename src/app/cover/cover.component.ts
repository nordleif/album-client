import { Component, OnDestroy, OnInit } from '@angular/core';
import { timer } from 'rxjs';
import { switchMap, take, takeWhile, tap } from 'rxjs/operators';
import { RpcClient } from '../rpc-client';
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
    private readonly rpcClient: RpcClient,
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
      // tap(playing => console.log(playing)),
      tap(playing => this.albumUrl = playing.isPlaying ? playing.albumUrl : undefined),
      switchMap(playing => playing.isPlaying ? this.rpcClient.screenOn() : this.rpcClient.screenOff()),
    ).subscribe();
  }
}
