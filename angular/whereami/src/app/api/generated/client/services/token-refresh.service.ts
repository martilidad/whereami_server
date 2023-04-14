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

import { RefreshJsonWebToken } from '../models/refresh-json-web-token';

@Injectable({
  providedIn: 'root',
})
export class TokenRefreshService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation tokenRefreshCreate
   */
  static readonly TokenRefreshCreatePath = '/api/token-refresh/';

  /**
   * API View that returns a refreshed token (with new expiration) based on
   * existing token
   *
   * If 'orig_iat' field (original issued-at-time) is found, will first check
   * if it's within expiration window, then copy it to the new token
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `tokenRefreshCreate$Json()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  tokenRefreshCreate$Json$Response(params: {
    body: RefreshJsonWebToken
  },
  context?: HttpContext

): Observable<StrictHttpResponse<RefreshJsonWebToken>> {

    const rb = new RequestBuilder(this.rootUrl, TokenRefreshService.TokenRefreshCreatePath, 'post');
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
        return r as StrictHttpResponse<RefreshJsonWebToken>;
      })
    );
  }

  /**
   * API View that returns a refreshed token (with new expiration) based on
   * existing token
   *
   * If 'orig_iat' field (original issued-at-time) is found, will first check
   * if it's within expiration window, then copy it to the new token
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `tokenRefreshCreate$Json$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  tokenRefreshCreate$Json(params: {
    body: RefreshJsonWebToken
  },
  context?: HttpContext

): Observable<RefreshJsonWebToken> {

    return this.tokenRefreshCreate$Json$Response(params,context).pipe(
      map((r: StrictHttpResponse<RefreshJsonWebToken>) => r.body as RefreshJsonWebToken)
    );
  }

  /**
   * API View that returns a refreshed token (with new expiration) based on
   * existing token
   *
   * If 'orig_iat' field (original issued-at-time) is found, will first check
   * if it's within expiration window, then copy it to the new token
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `tokenRefreshCreate$XWwwFormUrlencoded()` instead.
   *
   * This method sends `application/x-www-form-urlencoded` and handles request body of type `application/x-www-form-urlencoded`.
   */
  tokenRefreshCreate$XWwwFormUrlencoded$Response(params: {
    body: RefreshJsonWebToken
  },
  context?: HttpContext

): Observable<StrictHttpResponse<RefreshJsonWebToken>> {

    const rb = new RequestBuilder(this.rootUrl, TokenRefreshService.TokenRefreshCreatePath, 'post');
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
        return r as StrictHttpResponse<RefreshJsonWebToken>;
      })
    );
  }

  /**
   * API View that returns a refreshed token (with new expiration) based on
   * existing token
   *
   * If 'orig_iat' field (original issued-at-time) is found, will first check
   * if it's within expiration window, then copy it to the new token
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `tokenRefreshCreate$XWwwFormUrlencoded$Response()` instead.
   *
   * This method sends `application/x-www-form-urlencoded` and handles request body of type `application/x-www-form-urlencoded`.
   */
  tokenRefreshCreate$XWwwFormUrlencoded(params: {
    body: RefreshJsonWebToken
  },
  context?: HttpContext

): Observable<RefreshJsonWebToken> {

    return this.tokenRefreshCreate$XWwwFormUrlencoded$Response(params,context).pipe(
      map((r: StrictHttpResponse<RefreshJsonWebToken>) => r.body as RefreshJsonWebToken)
    );
  }

  /**
   * API View that returns a refreshed token (with new expiration) based on
   * existing token
   *
   * If 'orig_iat' field (original issued-at-time) is found, will first check
   * if it's within expiration window, then copy it to the new token
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `tokenRefreshCreate$FormData()` instead.
   *
   * This method sends `multipart/form-data` and handles request body of type `multipart/form-data`.
   */
  tokenRefreshCreate$FormData$Response(params: {
    body: RefreshJsonWebToken
  },
  context?: HttpContext

): Observable<StrictHttpResponse<RefreshJsonWebToken>> {

    const rb = new RequestBuilder(this.rootUrl, TokenRefreshService.TokenRefreshCreatePath, 'post');
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
        return r as StrictHttpResponse<RefreshJsonWebToken>;
      })
    );
  }

  /**
   * API View that returns a refreshed token (with new expiration) based on
   * existing token
   *
   * If 'orig_iat' field (original issued-at-time) is found, will first check
   * if it's within expiration window, then copy it to the new token
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `tokenRefreshCreate$FormData$Response()` instead.
   *
   * This method sends `multipart/form-data` and handles request body of type `multipart/form-data`.
   */
  tokenRefreshCreate$FormData(params: {
    body: RefreshJsonWebToken
  },
  context?: HttpContext

): Observable<RefreshJsonWebToken> {

    return this.tokenRefreshCreate$FormData$Response(params,context).pipe(
      map((r: StrictHttpResponse<RefreshJsonWebToken>) => r.body as RefreshJsonWebToken)
    );
  }

}
