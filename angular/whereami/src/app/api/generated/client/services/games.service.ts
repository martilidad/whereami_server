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

import { Challenge } from '../models/challenge';
import { ChallengeGeneration } from '../models/challenge-generation';
import { Game } from '../models/game';
import { PaginatedGameList } from '../models/paginated-game-list';

@Injectable({
  providedIn: 'root',
})
export class GamesService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation gamesList
   */
  static readonly GamesListPath = '/api/games/';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `gamesList()` instead.
   *
   * This method doesn't expect any request body.
   */
  gamesList$Response(params?: {

    /**
     * Number of results to return per page.
     */
    limit?: number;

    /**
     * The initial index from which to return the results.
     */
    offset?: number;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<PaginatedGameList>> {

    const rb = new RequestBuilder(this.rootUrl, GamesService.GamesListPath, 'get');
    if (params) {
      rb.query('limit', params.limit, {});
      rb.query('offset', params.offset, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<PaginatedGameList>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `gamesList$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  gamesList(params?: {

    /**
     * Number of results to return per page.
     */
    limit?: number;

    /**
     * The initial index from which to return the results.
     */
    offset?: number;
  },
  context?: HttpContext

): Observable<PaginatedGameList> {

    return this.gamesList$Response(params,context).pipe(
      map((r: StrictHttpResponse<PaginatedGameList>) => r.body as PaginatedGameList)
    );
  }

  /**
   * Path part for operation gamesCreate
   */
  static readonly GamesCreatePath = '/api/games/';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `gamesCreate$Json()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  gamesCreate$Json$Response(params: {
    body: Game
  },
  context?: HttpContext

): Observable<StrictHttpResponse<Game>> {

    const rb = new RequestBuilder(this.rootUrl, GamesService.GamesCreatePath, 'post');
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
        return r as StrictHttpResponse<Game>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `gamesCreate$Json$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  gamesCreate$Json(params: {
    body: Game
  },
  context?: HttpContext

): Observable<Game> {

    return this.gamesCreate$Json$Response(params,context).pipe(
      map((r: StrictHttpResponse<Game>) => r.body as Game)
    );
  }

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `gamesCreate$XWwwFormUrlencoded()` instead.
   *
   * This method sends `application/x-www-form-urlencoded` and handles request body of type `application/x-www-form-urlencoded`.
   */
  gamesCreate$XWwwFormUrlencoded$Response(params: {
    body: Game
  },
  context?: HttpContext

): Observable<StrictHttpResponse<Game>> {

    const rb = new RequestBuilder(this.rootUrl, GamesService.GamesCreatePath, 'post');
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
        return r as StrictHttpResponse<Game>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `gamesCreate$XWwwFormUrlencoded$Response()` instead.
   *
   * This method sends `application/x-www-form-urlencoded` and handles request body of type `application/x-www-form-urlencoded`.
   */
  gamesCreate$XWwwFormUrlencoded(params: {
    body: Game
  },
  context?: HttpContext

): Observable<Game> {

    return this.gamesCreate$XWwwFormUrlencoded$Response(params,context).pipe(
      map((r: StrictHttpResponse<Game>) => r.body as Game)
    );
  }

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `gamesCreate$FormData()` instead.
   *
   * This method sends `multipart/form-data` and handles request body of type `multipart/form-data`.
   */
  gamesCreate$FormData$Response(params: {
    body: Game
  },
  context?: HttpContext

): Observable<StrictHttpResponse<Game>> {

    const rb = new RequestBuilder(this.rootUrl, GamesService.GamesCreatePath, 'post');
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
        return r as StrictHttpResponse<Game>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `gamesCreate$FormData$Response()` instead.
   *
   * This method sends `multipart/form-data` and handles request body of type `multipart/form-data`.
   */
  gamesCreate$FormData(params: {
    body: Game
  },
  context?: HttpContext

): Observable<Game> {

    return this.gamesCreate$FormData$Response(params,context).pipe(
      map((r: StrictHttpResponse<Game>) => r.body as Game)
    );
  }

  /**
   * Path part for operation gamesRetrieve
   */
  static readonly GamesRetrievePath = '/api/games/{id}/';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `gamesRetrieve()` instead.
   *
   * This method doesn't expect any request body.
   */
  gamesRetrieve$Response(params: {

    /**
     * A unique integer value identifying this game.
     */
    id: number;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<Game>> {

    const rb = new RequestBuilder(this.rootUrl, GamesService.GamesRetrievePath, 'get');
    if (params) {
      rb.path('id', params.id, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Game>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `gamesRetrieve$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  gamesRetrieve(params: {

    /**
     * A unique integer value identifying this game.
     */
    id: number;
  },
  context?: HttpContext

): Observable<Game> {

    return this.gamesRetrieve$Response(params,context).pipe(
      map((r: StrictHttpResponse<Game>) => r.body as Game)
    );
  }

  /**
   * Path part for operation gamesGenerateChallengeCreate
   */
  static readonly GamesGenerateChallengeCreatePath = '/api/games/{id}/generate_challenge/';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `gamesGenerateChallengeCreate$Json()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  gamesGenerateChallengeCreate$Json$Response(params: {

    /**
     * A unique integer value identifying this game.
     */
    id: number;
    body: ChallengeGeneration
  },
  context?: HttpContext

): Observable<StrictHttpResponse<Challenge>> {

    const rb = new RequestBuilder(this.rootUrl, GamesService.GamesGenerateChallengeCreatePath, 'post');
    if (params) {
      rb.path('id', params.id, {});
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Challenge>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `gamesGenerateChallengeCreate$Json$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  gamesGenerateChallengeCreate$Json(params: {

    /**
     * A unique integer value identifying this game.
     */
    id: number;
    body: ChallengeGeneration
  },
  context?: HttpContext

): Observable<Challenge> {

    return this.gamesGenerateChallengeCreate$Json$Response(params,context).pipe(
      map((r: StrictHttpResponse<Challenge>) => r.body as Challenge)
    );
  }

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `gamesGenerateChallengeCreate$XWwwFormUrlencoded()` instead.
   *
   * This method sends `application/x-www-form-urlencoded` and handles request body of type `application/x-www-form-urlencoded`.
   */
  gamesGenerateChallengeCreate$XWwwFormUrlencoded$Response(params: {

    /**
     * A unique integer value identifying this game.
     */
    id: number;
    body: ChallengeGeneration
  },
  context?: HttpContext

): Observable<StrictHttpResponse<Challenge>> {

    const rb = new RequestBuilder(this.rootUrl, GamesService.GamesGenerateChallengeCreatePath, 'post');
    if (params) {
      rb.path('id', params.id, {});
      rb.body(params.body, 'application/x-www-form-urlencoded');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Challenge>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `gamesGenerateChallengeCreate$XWwwFormUrlencoded$Response()` instead.
   *
   * This method sends `application/x-www-form-urlencoded` and handles request body of type `application/x-www-form-urlencoded`.
   */
  gamesGenerateChallengeCreate$XWwwFormUrlencoded(params: {

    /**
     * A unique integer value identifying this game.
     */
    id: number;
    body: ChallengeGeneration
  },
  context?: HttpContext

): Observable<Challenge> {

    return this.gamesGenerateChallengeCreate$XWwwFormUrlencoded$Response(params,context).pipe(
      map((r: StrictHttpResponse<Challenge>) => r.body as Challenge)
    );
  }

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `gamesGenerateChallengeCreate$FormData()` instead.
   *
   * This method sends `multipart/form-data` and handles request body of type `multipart/form-data`.
   */
  gamesGenerateChallengeCreate$FormData$Response(params: {

    /**
     * A unique integer value identifying this game.
     */
    id: number;
    body: ChallengeGeneration
  },
  context?: HttpContext

): Observable<StrictHttpResponse<Challenge>> {

    const rb = new RequestBuilder(this.rootUrl, GamesService.GamesGenerateChallengeCreatePath, 'post');
    if (params) {
      rb.path('id', params.id, {});
      rb.body(params.body, 'multipart/form-data');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Challenge>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `gamesGenerateChallengeCreate$FormData$Response()` instead.
   *
   * This method sends `multipart/form-data` and handles request body of type `multipart/form-data`.
   */
  gamesGenerateChallengeCreate$FormData(params: {

    /**
     * A unique integer value identifying this game.
     */
    id: number;
    body: ChallengeGeneration
  },
  context?: HttpContext

): Observable<Challenge> {

    return this.gamesGenerateChallengeCreate$FormData$Response(params,context).pipe(
      map((r: StrictHttpResponse<Challenge>) => r.body as Challenge)
    );
  }

}
