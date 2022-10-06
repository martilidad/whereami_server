import {Injectable} from '@angular/core';
import {HandleError, HttpErrorHandler} from "../../http-error-handler.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {UserService} from "../user/user.service";
import {catchError, Observable} from "rxjs";
import {ChallengeOverview} from "../../model/game-model/challenge-overview";

@Injectable({
  providedIn: 'root'
})
export class ChallengeOverviewService {
  private readonly _url = "/api/challengeOverview"

  private readonly handleError: HandleError;

  constructor(private http: HttpClient,
              private userService: UserService,
              httpErrorHandler: HttpErrorHandler) {
    this.handleError = httpErrorHandler.createHandleError('ChallengeOverviewService');
  }

  private getHeaders() {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + this.userService.token
    });
  }


  getOverview(id: number): Observable<ChallengeOverview | undefined> {
    return this.http.get<ChallengeOverview>(this._url, {
      params: {id: id},
      headers: this.getHeaders()
    }).pipe(
        catchError(this.handleError('getGames', undefined))
      );
  }
}
