import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { catchError } from 'rxjs/internal/operators/catchError';
import { map } from 'rxjs/internal/operators/map';
import { share } from 'rxjs/internal/operators/share';
import { ReplaySubject } from 'rxjs/internal/ReplaySubject';
import { Subscribable } from 'rxjs/internal/types';
import {
  HandleError,
  HttpErrorHandler,
} from 'src/app/http-error-handler.service';
import { UserService } from '../user/user.service';

interface APIKeyResponse {
  google_api_key: string;
};
const _url = '/api/google-api-key/';

@Injectable({
  providedIn: 'root',
})
export class GoogleMapsApiService {
  private readonly handleError: HandleError;
  private _apiLoaded: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
  private _api_currently_loaded: boolean = false;

  constructor(
    private http: HttpClient,
    private userService: UserService,
    httpErrorHandler: HttpErrorHandler
  ) {
    this.handleError = httpErrorHandler.createHandleError('GamesService');
    this._apiLoaded.subscribe((val) => (this._api_currently_loaded = val));
    // TODO this should all be piped; so only a subscription to apiLoaded will triger a call
    // doesn't matter though... this app does nothing without google maps api
    userService.logged_in_emitter.subscribe((logged_in) => {
      if (logged_in && !this._api_currently_loaded) {
        this.getApiKey().subscribe((response) =>
          response ? this.loadApi(response.google_api_key) : {}
        );
      }
    });
  }

  private getApiKey(): Observable<APIKeyResponse | null> {
    return this.http
      .get<APIKeyResponse>(_url, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: 'JWT ' + this.userService.token,
        }),
      })
      .pipe(catchError(this.handleError('getGuesses', null)));
  }

  private loadApi(key: string) {
    this.http
      .jsonp(
        `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=geometry,drawing`,
        'callback'
      )
      .subscribe((val) => {
        this._apiLoaded.next(true);
      });
  }

  get apiLoaded(): Observable<boolean> {
    return this._apiLoaded;
  }
}
