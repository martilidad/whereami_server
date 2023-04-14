import { Injectable } from '@angular/core';
import { Observable, map } from "rxjs";
import { Game } from 'src/app/api/generated/client/models';
import { GamesService as ApiService } from '@client/services';


@Injectable({
  providedIn: 'root'
})
export class GamesService {

  constructor(private apiService: ApiService) {
  }

  getGames(): Observable<Game[]> {
    return this.apiService.gamesList().pipe(
      map(games => {
        return games.results!
      })
    );
  }

  createGame(game: Game): Observable<Game> {
    return this.apiService.gamesCreate$Json({body: game});
  }

}
