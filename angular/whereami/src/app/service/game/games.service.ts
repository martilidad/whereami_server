import { Injectable } from '@angular/core';
import { Observable, map } from "rxjs";
import { Game } from 'src/app/api/generated/client/models';
import { ApiService } from 'src/app/api/generated/client/services';


@Injectable({
  providedIn: 'root'
})
export class GamesService {

  constructor(private apiService: ApiService) {
  }

  getGames(): Observable<Game[]> {
    return this.apiService.apiGamesList().pipe(
      map(games => {
        return games.results!
      })
    );
  }

  createGame(game: Game): Observable<Game> {
    return this.apiService.apiGamesCreate$Json({body: game});
  }

}
