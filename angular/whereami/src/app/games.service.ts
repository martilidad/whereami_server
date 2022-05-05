import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, map, Observable} from "rxjs";
import {Game} from "./game";
import {HandleError, HttpErrorHandler} from "./http-error-handler.service";

export interface Games {
  games: Game[]
}

@Injectable({
  providedIn: 'root'
})
export class GamesService {
  gamesUrl = "/games"
  private handleError: HandleError;

  constructor(private http: HttpClient,
              httpErrorHandler: HttpErrorHandler) {
    this.handleError = httpErrorHandler.createHandleError('HeroesService');
  }

  getGames(): Observable<Game[]> {
    return this.http.get<Games>(this.gamesUrl)
      .pipe(
        catchError(this.handleError('getGames', []))
      ).pipe(
        //TODO change games to class and use instanceof/typeof?
        map(game => "games" in game ? game.games : [])
      );
  }

}
