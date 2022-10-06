import { Injectable } from '@angular/core';
import {HandleError, HttpErrorHandler} from "../../http-error-handler.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {UserService} from "../user/user.service";
import {Guess} from "../../model/game-model/guess";
import {catchError, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GuessService {
  private readonly handleError: HandleError;

  private readonly _url = '/api/guess';

  constructor(private http: HttpClient,
              private userService: UserService,
              httpErrorHandler: HttpErrorHandler) {
    this.handleError = httpErrorHandler.createHandleError('GuessService');
  }

  getHeaders() {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + this.userService.token
    })
  }

  submitGuess(guess: Guess) {
    this.http.post(this._url, guess,{
      headers: this.getHeaders()})
      .subscribe(value => console.log(value))
  }

  getGuesses(id: number): Observable<Guess[]> {
    return this.http.get<Guess[]>(this._url, {
      params: {Challenge_Location_ID: id},
      headers: this.getHeaders()
    })
    .pipe(
      catchError(this.handleError('getGuesses', []))
    );
  }
}
