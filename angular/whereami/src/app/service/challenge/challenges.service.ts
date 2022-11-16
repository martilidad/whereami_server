import {Injectable} from '@angular/core';
import {HandleError, HttpErrorHandler} from "../../http-error-handler.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Challenge} from "../../model/game-model/challenge";
import {catchError, map, Observable} from "rxjs";
import {UserService} from "../user/user.service";
import {RuntimeChallenge} from "../../model/game-model/runtime-challenge";
import {CreateChallenge} from "../../model/game-model/create-challenge";
import { deprecate } from 'util';


export interface Challenges {
  challenges: Challenge[]
}

@Injectable({
  providedIn: 'root'
})
export class ChallengesService {

  readonly challengesUrl = "/api/challenges/"
  readonly challengeUrl = "/api/challenge"

  private readonly handleError: HandleError;

  constructor(private http: HttpClient,
              private userService: UserService,
              httpErrorHandler: HttpErrorHandler) {
    this.handleError = httpErrorHandler.createHandleError('ChallengesService');
  }

  getChallenges(): Observable<Challenge[]> {
    return this.http.get<Challenge[]>(this.challengesUrl, {
      headers: this.getHeaders()
    })
      .pipe(
        catchError(this.handleError('getGames', []))
      );
  }

  getRuntimeChallenges(max: number): Observable<RuntimeChallenge[]> {
    return this.http.get<{results: RuntimeChallenge[]}>(this.challengesUrl, {
      headers: this.getHeaders(),
      params: {limit: max, offset: 0}
    })
      .pipe(map(result => result.results))
      .pipe(
        catchError(this.handleError('getGames', []))
      )
  }

  private getHeaders() {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + this.userService.token
    });
  }

  /**
   * @deprecated
   */
  public getChallenge(id: number, ignorePreviousGuesses: boolean): Observable<RuntimeChallenge> {
    return this.http.get<RuntimeChallenge>(this.challengeUrl,
      {
        headers: this.getHeaders(),
        params: {
          'Challenge_ID': id,
          'ignore_previous_guesses': ignorePreviousGuesses
        }
      })
  }

  

  public getChallengeById(id: number): Observable<RuntimeChallenge> {
    return this.http.get<RuntimeChallenge>("/api/challenges/"+id,
      {
        headers: this.getHeaders()
      })
  }

  public createChallenge(challenge: CreateChallenge): Observable<void> {
    return this.http.post<void>(this.challengeUrl, challenge, {headers: this.getHeaders()})
  }

}

