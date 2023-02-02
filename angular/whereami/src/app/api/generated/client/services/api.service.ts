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
import { ChallengeLocation } from '../models/challenge-location';
import { Game } from '../models/game';
import { Guess } from '../models/guess';
import { JsonWebToken } from '../models/json-web-token';
import { PaginatedChallengeList } from '../models/paginated-challenge-list';
import { PaginatedChallengeLocationList } from '../models/paginated-challenge-location-list';
import { PaginatedGameList } from '../models/paginated-game-list';
import { PaginatedGuessList } from '../models/paginated-guess-list';
import { RefreshJsonWebToken } from '../models/refresh-json-web-token';

@Injectable({
  providedIn: 'root',
})
export class ApiService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation apiChallengelocationsList
   */
  static readonly ApiChallengelocationsListPath = '/api/challengelocations/';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiChallengelocationsList()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiChallengelocationsList$Response(params?: {

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

): Observable<StrictHttpResponse<PaginatedChallengeLocationList>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.ApiChallengelocationsListPath, 'get');
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
        return r as StrictHttpResponse<PaginatedChallengeLocationList>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiChallengelocationsList$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiChallengelocationsList(params?: {

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

): Observable<PaginatedChallengeLocationList> {

    return this.apiChallengelocationsList$Response(params,context).pipe(
      map((r: StrictHttpResponse<PaginatedChallengeLocationList>) => r.body as PaginatedChallengeLocationList)
    );
  }

  /**
   * Path part for operation apiChallengelocationsGuessesList
   */
  static readonly ApiChallengelocationsGuessesListPath = '/api/challengelocations/{challengelocation_pk}/guesses/';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiChallengelocationsGuessesList()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiChallengelocationsGuessesList$Response(params: {

    /**
     * ID of the Challenge Location resource
     */
    challengelocation_pk: number;

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

): Observable<StrictHttpResponse<PaginatedGuessList>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.ApiChallengelocationsGuessesListPath, 'get');
    if (params) {
      rb.path('challengelocation_pk', params.challengelocation_pk, {});
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
        return r as StrictHttpResponse<PaginatedGuessList>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiChallengelocationsGuessesList$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiChallengelocationsGuessesList(params: {

    /**
     * ID of the Challenge Location resource
     */
    challengelocation_pk: number;

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

): Observable<PaginatedGuessList> {

    return this.apiChallengelocationsGuessesList$Response(params,context).pipe(
      map((r: StrictHttpResponse<PaginatedGuessList>) => r.body as PaginatedGuessList)
    );
  }

  /**
   * Path part for operation apiChallengelocationsGuessesCreate
   */
  static readonly ApiChallengelocationsGuessesCreatePath = '/api/challengelocations/{challengelocation_pk}/guesses/';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiChallengelocationsGuessesCreate$Json()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  apiChallengelocationsGuessesCreate$Json$Response(params: {

    /**
     * ID of the Challenge Location resource
     */
    challengelocation_pk: number;
    body: Guess
  },
  context?: HttpContext

): Observable<StrictHttpResponse<Guess>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.ApiChallengelocationsGuessesCreatePath, 'post');
    if (params) {
      rb.path('challengelocation_pk', params.challengelocation_pk, {});
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Guess>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiChallengelocationsGuessesCreate$Json$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  apiChallengelocationsGuessesCreate$Json(params: {

    /**
     * ID of the Challenge Location resource
     */
    challengelocation_pk: number;
    body: Guess
  },
  context?: HttpContext

): Observable<Guess> {

    return this.apiChallengelocationsGuessesCreate$Json$Response(params,context).pipe(
      map((r: StrictHttpResponse<Guess>) => r.body as Guess)
    );
  }

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiChallengelocationsGuessesCreate$XWwwFormUrlencoded()` instead.
   *
   * This method sends `application/x-www-form-urlencoded` and handles request body of type `application/x-www-form-urlencoded`.
   */
  apiChallengelocationsGuessesCreate$XWwwFormUrlencoded$Response(params: {

    /**
     * ID of the Challenge Location resource
     */
    challengelocation_pk: number;
    body: Guess
  },
  context?: HttpContext

): Observable<StrictHttpResponse<Guess>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.ApiChallengelocationsGuessesCreatePath, 'post');
    if (params) {
      rb.path('challengelocation_pk', params.challengelocation_pk, {});
      rb.body(params.body, 'application/x-www-form-urlencoded');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Guess>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiChallengelocationsGuessesCreate$XWwwFormUrlencoded$Response()` instead.
   *
   * This method sends `application/x-www-form-urlencoded` and handles request body of type `application/x-www-form-urlencoded`.
   */
  apiChallengelocationsGuessesCreate$XWwwFormUrlencoded(params: {

    /**
     * ID of the Challenge Location resource
     */
    challengelocation_pk: number;
    body: Guess
  },
  context?: HttpContext

): Observable<Guess> {

    return this.apiChallengelocationsGuessesCreate$XWwwFormUrlencoded$Response(params,context).pipe(
      map((r: StrictHttpResponse<Guess>) => r.body as Guess)
    );
  }

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiChallengelocationsGuessesCreate$FormData()` instead.
   *
   * This method sends `multipart/form-data` and handles request body of type `multipart/form-data`.
   */
  apiChallengelocationsGuessesCreate$FormData$Response(params: {

    /**
     * ID of the Challenge Location resource
     */
    challengelocation_pk: number;
    body: Guess
  },
  context?: HttpContext

): Observable<StrictHttpResponse<Guess>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.ApiChallengelocationsGuessesCreatePath, 'post');
    if (params) {
      rb.path('challengelocation_pk', params.challengelocation_pk, {});
      rb.body(params.body, 'multipart/form-data');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Guess>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiChallengelocationsGuessesCreate$FormData$Response()` instead.
   *
   * This method sends `multipart/form-data` and handles request body of type `multipart/form-data`.
   */
  apiChallengelocationsGuessesCreate$FormData(params: {

    /**
     * ID of the Challenge Location resource
     */
    challengelocation_pk: number;
    body: Guess
  },
  context?: HttpContext

): Observable<Guess> {

    return this.apiChallengelocationsGuessesCreate$FormData$Response(params,context).pipe(
      map((r: StrictHttpResponse<Guess>) => r.body as Guess)
    );
  }

  /**
   * Path part for operation apiChallengelocationsGuessesRetrieve
   */
  static readonly ApiChallengelocationsGuessesRetrievePath = '/api/challengelocations/{challengelocation_pk}/guesses/{id}/';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiChallengelocationsGuessesRetrieve()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiChallengelocationsGuessesRetrieve$Response(params: {

    /**
     * ID of the Challenge Location resource
     */
    challengelocation_pk: number;

    /**
     * A unique integer value identifying this guess.
     */
    id: number;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<Guess>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.ApiChallengelocationsGuessesRetrievePath, 'get');
    if (params) {
      rb.path('challengelocation_pk', params.challengelocation_pk, {});
      rb.path('id', params.id, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Guess>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiChallengelocationsGuessesRetrieve$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiChallengelocationsGuessesRetrieve(params: {

    /**
     * ID of the Challenge Location resource
     */
    challengelocation_pk: number;

    /**
     * A unique integer value identifying this guess.
     */
    id: number;
  },
  context?: HttpContext

): Observable<Guess> {

    return this.apiChallengelocationsGuessesRetrieve$Response(params,context).pipe(
      map((r: StrictHttpResponse<Guess>) => r.body as Guess)
    );
  }

  /**
   * Path part for operation apiChallengelocationsRetrieve
   */
  static readonly ApiChallengelocationsRetrievePath = '/api/challengelocations/{id}/';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiChallengelocationsRetrieve()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiChallengelocationsRetrieve$Response(params: {

    /**
     * A unique integer value identifying this challenge location.
     */
    id: number;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<ChallengeLocation>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.ApiChallengelocationsRetrievePath, 'get');
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
        return r as StrictHttpResponse<ChallengeLocation>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiChallengelocationsRetrieve$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiChallengelocationsRetrieve(params: {

    /**
     * A unique integer value identifying this challenge location.
     */
    id: number;
  },
  context?: HttpContext

): Observable<ChallengeLocation> {

    return this.apiChallengelocationsRetrieve$Response(params,context).pipe(
      map((r: StrictHttpResponse<ChallengeLocation>) => r.body as ChallengeLocation)
    );
  }

  /**
   * Path part for operation apiChallengesList
   */
  static readonly ApiChallengesListPath = '/api/challenges/';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiChallengesList()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiChallengesList$Response(params?: {

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

): Observable<StrictHttpResponse<PaginatedChallengeList>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.ApiChallengesListPath, 'get');
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
        return r as StrictHttpResponse<PaginatedChallengeList>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiChallengesList$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiChallengesList(params?: {

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

): Observable<PaginatedChallengeList> {

    return this.apiChallengesList$Response(params,context).pipe(
      map((r: StrictHttpResponse<PaginatedChallengeList>) => r.body as PaginatedChallengeList)
    );
  }

  /**
   * Path part for operation apiChallengesRetrieve
   */
  static readonly ApiChallengesRetrievePath = '/api/challenges/{id}/';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiChallengesRetrieve()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiChallengesRetrieve$Response(params: {

    /**
     * A unique integer value identifying this challenge.
     */
    id: number;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<Challenge>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.ApiChallengesRetrievePath, 'get');
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
        return r as StrictHttpResponse<Challenge>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiChallengesRetrieve$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiChallengesRetrieve(params: {

    /**
     * A unique integer value identifying this challenge.
     */
    id: number;
  },
  context?: HttpContext

): Observable<Challenge> {

    return this.apiChallengesRetrieve$Response(params,context).pipe(
      map((r: StrictHttpResponse<Challenge>) => r.body as Challenge)
    );
  }

  /**
   * Path part for operation apiGamesList
   */
  static readonly ApiGamesListPath = '/api/games/';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiGamesList()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiGamesList$Response(params?: {

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

    const rb = new RequestBuilder(this.rootUrl, ApiService.ApiGamesListPath, 'get');
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
   * To access the full response (for headers, for example), `apiGamesList$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiGamesList(params?: {

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

    return this.apiGamesList$Response(params,context).pipe(
      map((r: StrictHttpResponse<PaginatedGameList>) => r.body as PaginatedGameList)
    );
  }

  /**
   * Path part for operation apiGamesCreate
   */
  static readonly ApiGamesCreatePath = '/api/games/';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiGamesCreate$Json()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  apiGamesCreate$Json$Response(params: {
    body: Game
  },
  context?: HttpContext

): Observable<StrictHttpResponse<Game>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.ApiGamesCreatePath, 'post');
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
   * To access the full response (for headers, for example), `apiGamesCreate$Json$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  apiGamesCreate$Json(params: {
    body: Game
  },
  context?: HttpContext

): Observable<Game> {

    return this.apiGamesCreate$Json$Response(params,context).pipe(
      map((r: StrictHttpResponse<Game>) => r.body as Game)
    );
  }

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiGamesCreate$XWwwFormUrlencoded()` instead.
   *
   * This method sends `application/x-www-form-urlencoded` and handles request body of type `application/x-www-form-urlencoded`.
   */
  apiGamesCreate$XWwwFormUrlencoded$Response(params: {
    body: Game
  },
  context?: HttpContext

): Observable<StrictHttpResponse<Game>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.ApiGamesCreatePath, 'post');
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
   * To access the full response (for headers, for example), `apiGamesCreate$XWwwFormUrlencoded$Response()` instead.
   *
   * This method sends `application/x-www-form-urlencoded` and handles request body of type `application/x-www-form-urlencoded`.
   */
  apiGamesCreate$XWwwFormUrlencoded(params: {
    body: Game
  },
  context?: HttpContext

): Observable<Game> {

    return this.apiGamesCreate$XWwwFormUrlencoded$Response(params,context).pipe(
      map((r: StrictHttpResponse<Game>) => r.body as Game)
    );
  }

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiGamesCreate$FormData()` instead.
   *
   * This method sends `multipart/form-data` and handles request body of type `multipart/form-data`.
   */
  apiGamesCreate$FormData$Response(params: {
    body: Game
  },
  context?: HttpContext

): Observable<StrictHttpResponse<Game>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.ApiGamesCreatePath, 'post');
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
   * To access the full response (for headers, for example), `apiGamesCreate$FormData$Response()` instead.
   *
   * This method sends `multipart/form-data` and handles request body of type `multipart/form-data`.
   */
  apiGamesCreate$FormData(params: {
    body: Game
  },
  context?: HttpContext

): Observable<Game> {

    return this.apiGamesCreate$FormData$Response(params,context).pipe(
      map((r: StrictHttpResponse<Game>) => r.body as Game)
    );
  }

  /**
   * Path part for operation apiGamesRetrieve
   */
  static readonly ApiGamesRetrievePath = '/api/games/{id}/';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiGamesRetrieve()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiGamesRetrieve$Response(params: {

    /**
     * A unique integer value identifying this game.
     */
    id: number;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<Game>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.ApiGamesRetrievePath, 'get');
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
   * To access the full response (for headers, for example), `apiGamesRetrieve$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiGamesRetrieve(params: {

    /**
     * A unique integer value identifying this game.
     */
    id: number;
  },
  context?: HttpContext

): Observable<Game> {

    return this.apiGamesRetrieve$Response(params,context).pipe(
      map((r: StrictHttpResponse<Game>) => r.body as Game)
    );
  }

  /**
   * Path part for operation apiGamesGenerateChallengeCreate
   */
  static readonly ApiGamesGenerateChallengeCreatePath = '/api/games/{id}/generate_challenge/';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiGamesGenerateChallengeCreate$Json()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  apiGamesGenerateChallengeCreate$Json$Response(params: {

    /**
     * A unique integer value identifying this game.
     */
    id: number;
    body: ChallengeGeneration
  },
  context?: HttpContext

): Observable<StrictHttpResponse<Challenge>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.ApiGamesGenerateChallengeCreatePath, 'post');
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
   * To access the full response (for headers, for example), `apiGamesGenerateChallengeCreate$Json$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  apiGamesGenerateChallengeCreate$Json(params: {

    /**
     * A unique integer value identifying this game.
     */
    id: number;
    body: ChallengeGeneration
  },
  context?: HttpContext

): Observable<Challenge> {

    return this.apiGamesGenerateChallengeCreate$Json$Response(params,context).pipe(
      map((r: StrictHttpResponse<Challenge>) => r.body as Challenge)
    );
  }

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiGamesGenerateChallengeCreate$XWwwFormUrlencoded()` instead.
   *
   * This method sends `application/x-www-form-urlencoded` and handles request body of type `application/x-www-form-urlencoded`.
   */
  apiGamesGenerateChallengeCreate$XWwwFormUrlencoded$Response(params: {

    /**
     * A unique integer value identifying this game.
     */
    id: number;
    body: ChallengeGeneration
  },
  context?: HttpContext

): Observable<StrictHttpResponse<Challenge>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.ApiGamesGenerateChallengeCreatePath, 'post');
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
   * To access the full response (for headers, for example), `apiGamesGenerateChallengeCreate$XWwwFormUrlencoded$Response()` instead.
   *
   * This method sends `application/x-www-form-urlencoded` and handles request body of type `application/x-www-form-urlencoded`.
   */
  apiGamesGenerateChallengeCreate$XWwwFormUrlencoded(params: {

    /**
     * A unique integer value identifying this game.
     */
    id: number;
    body: ChallengeGeneration
  },
  context?: HttpContext

): Observable<Challenge> {

    return this.apiGamesGenerateChallengeCreate$XWwwFormUrlencoded$Response(params,context).pipe(
      map((r: StrictHttpResponse<Challenge>) => r.body as Challenge)
    );
  }

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiGamesGenerateChallengeCreate$FormData()` instead.
   *
   * This method sends `multipart/form-data` and handles request body of type `multipart/form-data`.
   */
  apiGamesGenerateChallengeCreate$FormData$Response(params: {

    /**
     * A unique integer value identifying this game.
     */
    id: number;
    body: ChallengeGeneration
  },
  context?: HttpContext

): Observable<StrictHttpResponse<Challenge>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.ApiGamesGenerateChallengeCreatePath, 'post');
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
   * To access the full response (for headers, for example), `apiGamesGenerateChallengeCreate$FormData$Response()` instead.
   *
   * This method sends `multipart/form-data` and handles request body of type `multipart/form-data`.
   */
  apiGamesGenerateChallengeCreate$FormData(params: {

    /**
     * A unique integer value identifying this game.
     */
    id: number;
    body: ChallengeGeneration
  },
  context?: HttpContext

): Observable<Challenge> {

    return this.apiGamesGenerateChallengeCreate$FormData$Response(params,context).pipe(
      map((r: StrictHttpResponse<Challenge>) => r.body as Challenge)
    );
  }

  /**
   * Path part for operation apiTokenAuthCreate
   */
  static readonly ApiTokenAuthCreatePath = '/api/token-auth/';

  /**
   * API View that receives a POST with a user's username and password.
   *
   * Returns a JSON Web Token that can be used for authenticated requests.
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiTokenAuthCreate$Json()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  apiTokenAuthCreate$Json$Response(params: {
    body: JsonWebToken
  },
  context?: HttpContext

): Observable<StrictHttpResponse<JsonWebToken>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.ApiTokenAuthCreatePath, 'post');
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
   * To access the full response (for headers, for example), `apiTokenAuthCreate$Json$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  apiTokenAuthCreate$Json(params: {
    body: JsonWebToken
  },
  context?: HttpContext

): Observable<JsonWebToken> {

    return this.apiTokenAuthCreate$Json$Response(params,context).pipe(
      map((r: StrictHttpResponse<JsonWebToken>) => r.body as JsonWebToken)
    );
  }

  /**
   * API View that receives a POST with a user's username and password.
   *
   * Returns a JSON Web Token that can be used for authenticated requests.
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiTokenAuthCreate$XWwwFormUrlencoded()` instead.
   *
   * This method sends `application/x-www-form-urlencoded` and handles request body of type `application/x-www-form-urlencoded`.
   */
  apiTokenAuthCreate$XWwwFormUrlencoded$Response(params: {
    body: JsonWebToken
  },
  context?: HttpContext

): Observable<StrictHttpResponse<JsonWebToken>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.ApiTokenAuthCreatePath, 'post');
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
   * To access the full response (for headers, for example), `apiTokenAuthCreate$XWwwFormUrlencoded$Response()` instead.
   *
   * This method sends `application/x-www-form-urlencoded` and handles request body of type `application/x-www-form-urlencoded`.
   */
  apiTokenAuthCreate$XWwwFormUrlencoded(params: {
    body: JsonWebToken
  },
  context?: HttpContext

): Observable<JsonWebToken> {

    return this.apiTokenAuthCreate$XWwwFormUrlencoded$Response(params,context).pipe(
      map((r: StrictHttpResponse<JsonWebToken>) => r.body as JsonWebToken)
    );
  }

  /**
   * API View that receives a POST with a user's username and password.
   *
   * Returns a JSON Web Token that can be used for authenticated requests.
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiTokenAuthCreate$FormData()` instead.
   *
   * This method sends `multipart/form-data` and handles request body of type `multipart/form-data`.
   */
  apiTokenAuthCreate$FormData$Response(params: {
    body: JsonWebToken
  },
  context?: HttpContext

): Observable<StrictHttpResponse<JsonWebToken>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.ApiTokenAuthCreatePath, 'post');
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
   * To access the full response (for headers, for example), `apiTokenAuthCreate$FormData$Response()` instead.
   *
   * This method sends `multipart/form-data` and handles request body of type `multipart/form-data`.
   */
  apiTokenAuthCreate$FormData(params: {
    body: JsonWebToken
  },
  context?: HttpContext

): Observable<JsonWebToken> {

    return this.apiTokenAuthCreate$FormData$Response(params,context).pipe(
      map((r: StrictHttpResponse<JsonWebToken>) => r.body as JsonWebToken)
    );
  }

  /**
   * Path part for operation apiTokenRefreshCreate
   */
  static readonly ApiTokenRefreshCreatePath = '/api/token-refresh/';

  /**
   * API View that returns a refreshed token (with new expiration) based on
   * existing token
   *
   * If 'orig_iat' field (original issued-at-time) is found, will first check
   * if it's within expiration window, then copy it to the new token
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiTokenRefreshCreate$Json()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  apiTokenRefreshCreate$Json$Response(params: {
    body: RefreshJsonWebToken
  },
  context?: HttpContext

): Observable<StrictHttpResponse<RefreshJsonWebToken>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.ApiTokenRefreshCreatePath, 'post');
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
   * To access the full response (for headers, for example), `apiTokenRefreshCreate$Json$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  apiTokenRefreshCreate$Json(params: {
    body: RefreshJsonWebToken
  },
  context?: HttpContext

): Observable<RefreshJsonWebToken> {

    return this.apiTokenRefreshCreate$Json$Response(params,context).pipe(
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
   * To access only the response body, use `apiTokenRefreshCreate$XWwwFormUrlencoded()` instead.
   *
   * This method sends `application/x-www-form-urlencoded` and handles request body of type `application/x-www-form-urlencoded`.
   */
  apiTokenRefreshCreate$XWwwFormUrlencoded$Response(params: {
    body: RefreshJsonWebToken
  },
  context?: HttpContext

): Observable<StrictHttpResponse<RefreshJsonWebToken>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.ApiTokenRefreshCreatePath, 'post');
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
   * To access the full response (for headers, for example), `apiTokenRefreshCreate$XWwwFormUrlencoded$Response()` instead.
   *
   * This method sends `application/x-www-form-urlencoded` and handles request body of type `application/x-www-form-urlencoded`.
   */
  apiTokenRefreshCreate$XWwwFormUrlencoded(params: {
    body: RefreshJsonWebToken
  },
  context?: HttpContext

): Observable<RefreshJsonWebToken> {

    return this.apiTokenRefreshCreate$XWwwFormUrlencoded$Response(params,context).pipe(
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
   * To access only the response body, use `apiTokenRefreshCreate$FormData()` instead.
   *
   * This method sends `multipart/form-data` and handles request body of type `multipart/form-data`.
   */
  apiTokenRefreshCreate$FormData$Response(params: {
    body: RefreshJsonWebToken
  },
  context?: HttpContext

): Observable<StrictHttpResponse<RefreshJsonWebToken>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.ApiTokenRefreshCreatePath, 'post');
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
   * To access the full response (for headers, for example), `apiTokenRefreshCreate$FormData$Response()` instead.
   *
   * This method sends `multipart/form-data` and handles request body of type `multipart/form-data`.
   */
  apiTokenRefreshCreate$FormData(params: {
    body: RefreshJsonWebToken
  },
  context?: HttpContext

): Observable<RefreshJsonWebToken> {

    return this.apiTokenRefreshCreate$FormData$Response(params,context).pipe(
      map((r: StrictHttpResponse<RefreshJsonWebToken>) => r.body as RefreshJsonWebToken)
    );
  }

}
