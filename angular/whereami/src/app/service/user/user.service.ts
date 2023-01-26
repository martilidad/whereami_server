import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {User} from "./user";
import {catchError, Observable, ReplaySubject, Subscribable, Subscription, timer} from "rxjs";
import {HandleError, HttpErrorHandler} from "../../http-error-handler.service";
import { SettingsService, TOKEN } from '../settings/settings.service';
import { Optional } from 'typescript-optional';
export class TokenResponse {
  token: string;

  constructor(token: string) {
    this.token = token;
  }
}

interface JwtToken {
  exp: number,
  username: string
}

interface Token {
  username: string,
  expires: Date
}

const TOKEN_REFRESH_MARGIN_MILLIS = 2000;

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // http options used for making API calls
  private httpOptions: any;
  private refresh_subscription: Subscription | undefined;
  private readonly _logged_in_emitter: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);

  // the actual JWT token
  private _token: string | null = null;

  public get token(): string | null {
    return this._token;
  }
  public set token(value: string | null) {
    this._token = value;
    this.settingsService.saveOpt(Optional.ofNullable(value), TOKEN);
  }

  // the token expiration date
  public token_expires: Date | null = null;

  // the username of the logged in user
  public username: string | null = null;

  // error messages received from the login attempt
  public errors: any = [];

  constructor(private http: HttpClient, private settingsService: SettingsService) {
    this.httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
    settingsService.loadOpt(TOKEN).ifPresent(token => {
      const decoded_token = this.toToken(token);
      if(decoded_token.expires > new Date()) {
        this.updateData(token)
      }
    });
  }

  // Uses http.post() to get an auth token from djangorestframework-jwt endpoint
  public login(user: User) {
    this.http.post<TokenResponse>('/api/token-auth/', JSON.stringify(user), this.httpOptions)
      .subscribe({
        next: (value) => "token" in value ? this.updateData(value["token"]) : {},
        error: error => this.handleError(error)
      });
  }

  // Refreshes the JWT token, to extend the time the user is logged in
  public refreshToken() {
    this.http.post<TokenResponse>('/api/token-refresh/', JSON.stringify({token: this.token}), this.httpOptions)
      .subscribe({
        next: (value) => "token" in value ? this.updateData(value["token"]) : {},
        error: error => this.handleError(error)
      });
  }

  private handleError(error: any) {
    this.errors = error.error;
    this.logout();
  }

  public logout() {
    this.token = null;
    this.token_expires = null;
    this.username = null;
  }


  private updateData(token: string) {
    //type safety my ass?????
    this.token = token;
    this.errors = [];

    this.updateToken(this.toToken(this.token));
  }

  private updateToken(token: Token) {
    this.token_expires = token.expires;
    this.username = token.username;

    // handle callbacks and subscriptions
    this.refresh_subscription?.unsubscribe();
    let refresh_time = new Date(this.token_expires.getTime() - TOKEN_REFRESH_MARGIN_MILLIS);
    this.refresh_subscription = timer(refresh_time).subscribe(() => this.refreshToken());
    this._logged_in_emitter.next(true);
  }

  private toToken(token: string): Token {
    const decoded = this.decodeToken(token);
    return {username: decoded.username, expires: new Date(decoded.exp * 1000)}
  }

  private decodeToken(token: string): JwtToken {
    const token_parts = token.split(/\./);
    return JSON.parse(window.atob(token_parts[1]));    
  }

  
  get logged_in_emitter(): Observable<boolean> {
    return this._logged_in_emitter;
  }

}
