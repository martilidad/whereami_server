import {Injectable} from '@angular/core';
import {HandleError, HttpErrorHandler} from "../../http-error-handler.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Challenge} from "./challenge";
import {catchError, map, Observable} from "rxjs";
import {Game} from "../game/game";
import {Games} from "../game/games.service";
import {UserService} from "../user/user.service";


export interface Challenges {
  challenges: Challenge[]
}

@Injectable({
  providedIn: 'root'
})
export class ChallengesService {

  gamesUrl = "/challenges/"
  private handleError: HandleError;

  constructor(private http: HttpClient,
              private userService: UserService,
              httpErrorHandler: HttpErrorHandler) {
    this.handleError = httpErrorHandler.createHandleError('ChallengesService');
  }

  getChallenges(): Observable<Challenge[]> {
    return this.http.get<Challenge[]>(this.gamesUrl, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'JWT ' + this.userService.token
      })
    })
      .pipe(
        catchError(this.handleError('getGames', []))
      );
  }

}

