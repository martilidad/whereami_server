import {Injectable} from '@angular/core';
import {HandleError, HttpErrorHandler} from "./http-error-handler.service";
import {HttpClient} from "@angular/common/http";
import {Challenge} from "./challenge";
import {catchError, map, Observable} from "rxjs";
import {Game} from "./game";
import {Games} from "./games.service";


export interface Challenges {
  challenges: Challenge[]
}

@Injectable({
  providedIn: 'root'
})
export class ChallengesService {

  gamesUrl = "/challenges"
  private handleError: HandleError;

  constructor(private http: HttpClient,
              httpErrorHandler: HttpErrorHandler) {
    this.handleError = httpErrorHandler.createHandleError('ChallengesService');
  }

  getChallenges(): Observable<Challenge[]> {
    return this.http.get<Challenges>(this.gamesUrl)
      .pipe(
        catchError(this.handleError('getGames', []))
      ).pipe(
        //TODO change games to class and use instanceof/typeof?
        map(challenge => "challenges" in challenge ? challenge.challenges : [])
      );
  }

}

