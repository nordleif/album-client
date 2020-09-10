import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SpotifyClient {
  public constructor(
    private readonly httpClient: HttpClient,
  ) { }

  public getCurrentlyPlaying() {
    const url = 'https://api.spotify.com/v1/me/player/currently-playing';
    return this.httpClient.get(url).pipe(
      map((result: any) => {
        let albumUrl = '';

        if (result) {
          albumUrl = result.item.album.images[0].url;
        }

        return albumUrl;
      })
    );
  }
}
