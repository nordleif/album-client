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
        let albumType = '';
        let albumName = '';
        let albumUrl = '';
        let artistName = '';
        let isPlaying = false;
        if (result && result.item && result.item.album) {
          albumType = result.item.album.album_type;
          albumName = result.item.album;
          albumUrl = result.item.album.images[0].url;
          artistName = result.item.artists && result.item.artists.length > 0 ? result.item.album.artists[0].name : '';
          isPlaying = result.is_playing;
        }
        return { albumType, albumName, albumUrl, artistName, isPlaying };
      })
    );
  }
}
