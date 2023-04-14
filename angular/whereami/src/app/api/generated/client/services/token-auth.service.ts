/* tslint:disable */
/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpContext } from '@angular/common/http';
import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';
import { RequestBuilder } from '../request-builder';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import { JsonWebToken } from '../models/json-web-token';

@Injectable({
  providedIn: 'root',
})
export class TokenAuthService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation tokenAuthCreate
   */
  static readonly TokenAuthCreatePath = '/api/token-auth/';

  /**
   * API View that receives a POST with a user's username and password.
   *
   * Returns a JSON Web Token that can be used for authenticated requests.
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `tokenAuthCreate$Json()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  tokenAuthCreate$Json$Response(params: {
    body: JsonWebToken
  },
  context?: HttpContext

): Observable<StrictHttpResponse<JsonWebToken>> {

    const rb = new RequestBuilder(this.rootUrl, TokenAuthService.TokenAuthCreatePath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<JsonWebToken>;
      })
    );
  }

  /**
   * API View that receives a POST with a user's username and password.
   *
   * Returns a JSON Web Token that can be used for authenticated requests.
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `tokenAuthCreate$Json$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  tokenAuthCreate$Json(params: {
    body: JsonWebToken
  },
  context?: HttpContext

): Observable<JsonWebToken> {

    return this.tokenAuthCreate$Json$Response(params,context).pipe(
      map((r: StrictHttpResponse<JsonWebToken>) => r.body as JsonWebToken)
    );
  }

  /**
   * API View that receives a POST with a user's username and password.
   *
   * Returns a JSON Web Token that can be used for authenticated requests.
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `tokenAuthCreate$XWwwFormUrlencoded()` instead.
   *
   * This method sends `application/x-www-form-urlencoded` and handles request body of type `application/x-www-form-urlencoded`.
   */
  tokenAuthCreate$XWwwFormUrlencoded$Response(params: {
    body: JsonWebToken
  },
  context?: HttpContext

): Observable<StrictHttpResponse<JsonWebToken>> {

    const rb = new RequestBuilder(this.rootUrl, TokenAuthService.TokenAuthCreatePath, 'post');
    if (params) {
      rb.body(params.body, 'application/x-www-form-urlencoded');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<JsonWebToken>;
      })
    );
  }

  /**
   * API View that receives a POST with a user's username and password.
   *
   * Returns a JSON Web Token that can be used for authenticated requests.
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `tokenAuthCreate$XWwwFormUrlencoded$Response()` instead.
   *
   * This method sends `application/x-www-form-urlencoded` and handles request body of type `application/x-www-form-urlencoded`.
   */
  tokenAuthCreate$XWwwFormUrlencoded(params: {
    body: JsonWebToken
  },
  context?: HttpContext

): Observable<JsonWebToken> {

    return this.tokenAuthCreate$XWwwFormUrlencoded$Response(params,context).pipe(
      map((r: StrictHttpResponse<JsonWebToken>) => r.body as JsonWebToken)
    );
  }

  /**
   * API View that receives a POST with a user's username and password.
   *
   * Returns a JSON Web Token that can be used for authenticated requests.
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `tokenAuthCreate$FormData()` instead.
   *
   * This method sends `multipart/form-data` and handles request body of type `multipart/form-data`.
   */
  tokenAuthCreate$FormData$Response(params: {
    body: JsonWebToken
  },
  context?: HttpContext

): Observable<StrictHttpResponse<JsonWebToken>> {

    const rb = new RequestBuilder(this.rootUrl, TokenAuthService.TokenAuthCreatePath, 'post');
    if (params) {
      rb.body(params.body, 'multipart/form-data');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<JsonWebToken>;
      })
    );
  }

  /**
   * API View that receives a POST with a user's username and password.
   *
   * Returns a JSON Web Token that can be used for authenticated requests.
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `tokenAuthCreate$FormData$Response()` instead.
   *
   * This method sends `multipart/form-data` and handles request body of type `multipart/form-data`.
   */
  tokenAuthCreate$FormData(params: {
    body: JsonWebToken
  },
  context?: HttpContext

): Observable<JsonWebToken> {

    return this.tokenAuthCreate$FormData$Response(params,context).pipe(
      map((r: StrictHttpResponse<JsonWebToken>) => r.body as JsonWebToken)
    );
  }

}
