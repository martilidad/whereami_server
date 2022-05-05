import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {User} from "./user";
import {catchError} from "rxjs";
import {HandleError, HttpErrorHandler} from "./http-error-handler.service";

export class TokenResponse {
  token: string;

  constructor(token: string) {
    this.token = token;
  }
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // http options used for making API calls
  private httpOptions: any;
  private handleError: HandleError;

  // the actual JWT token
  public token: string | null = null;

  // the token expiration date
  public token_expires: Date | null = null;

  // the username of the logged in user
  public username: string | null = null;

  // error messages received from the login attempt
  public errors: any = [];

  constructor(private http: HttpClient,
              httpErrorHandler: HttpErrorHandler) {
    this.handleError = httpErrorHandler.createHandleError('UserService')
    this.httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
  }

  // Uses http.post() to get an auth token from djangorestframework-jwt endpoint
  public login(user: User) {
    this.http.post<TokenResponse>('/api-token-auth/', JSON.stringify(user), this.httpOptions)
      .pipe(catchError(this.handleError('login', [])))
      .subscribe(value => "token" in value ? this.updateData(value) : {});
  }

  // Refreshes the JWT token, to extend the time the user is logged in
  public refreshToken() {
    this.http.post<TokenResponse>('/api-token-refresh/', JSON.stringify({token: this.token}), this.httpOptions)
      .pipe(catchError(this.handleError('login', [])))
      .subscribe(value => "token" in value ? this.updateData(value) : {});
  }

  public logout() {
    this.token = null;
    this.token_expires = null;
    this.username = null;
  }


  private updateData(tokenResponse: TokenResponse) {
    //type safety my ass?????
    this.token = tokenResponse.token;
    this.errors = [];

    // decode the token to read the username and expiration timestamp
    const token_parts = this.token.split(/\./);
    const token_decoded = JSON.parse(window.atob(token_parts[1]));
    this.token_expires = new Date(token_decoded.exp * 1000);
    this.username = token_decoded.username;
  }
}
