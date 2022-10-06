import {Injectable} from '@angular/core';
import {HandleError, HttpErrorHandler} from "../../http-error-handler.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {UserService} from "../user/user.service";
import {Guess} from "../../model/game-model/guess";
import {Score} from "../../model/game-model/score";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ScoreService {
  private readonly handleError: HandleError;

  private readonly _url = '/api/scores';

  constructor(private http: HttpClient,
              private userService: UserService,
              httpErrorHandler: HttpErrorHandler) {
    this.handleError = httpErrorHandler.createHandleError('GuessService');
  }

  getScores(id: number): Observable<Score[]> {
    return this.http.get<Score[]>(this._url,
      {
        params: {
          Challenge_ID: id
        },
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'JWT ' + this.userService.token
        })
      })

  }
}
