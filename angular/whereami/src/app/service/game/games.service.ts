import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, map, Observable} from "rxjs";
import {Game} from "./game";
import {HandleError, HttpErrorHandler} from "../../http-error-handler.service";
import {UserService} from "../user/user.service";
import {CreateGame} from "./create-game";

export interface Games {
  games: Game[]
}

@Injectable({
  providedIn: 'root'
})
export class GamesService {
  static gamesUrl = "/games/"
  static postUrl = "/game"

  private readonly handleError: HandleError;

  constructor(private http: HttpClient,
              private userService: UserService,
              httpErrorHandler: HttpErrorHandler) {
    this.handleError = httpErrorHandler.createHandleError('HeroesService');
  }

  getGames(): Observable<Game[]> {
    return this.http.get<Game[]>(GamesService.gamesUrl,{
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'JWT ' + this.userService.token
      })})
      .pipe(
        catchError(this.handleError('getGames', []))
      )
  }

  createGame(game: CreateGame): Observable<void> {
    return this.http.post<void>(GamesService.postUrl,game,{
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'JWT ' + this.userService.token
      })})
  }

}
