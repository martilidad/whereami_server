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

import { ChallengeLocation } from '../models/challenge-location';
import { Guess } from '../models/guess';
import { PaginatedChallengeLocationList } from '../models/paginated-challenge-location-list';
import { PaginatedGuessList } from '../models/paginated-guess-list';

@Injectable({
  providedIn: 'root',
})
export class ChallengelocationsService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation challengelocationsList
   */
  static readonly ChallengelocationsListPath = '/api/challengelocations/';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `challengelocationsList()` instead.
   *
   * This method doesn't expect any request body.
   */
  challengelocationsList$Response(params?: {

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

    const rb = new RequestBuilder(this.rootUrl, ChallengelocationsService.ChallengelocationsListPath, 'get');
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
   * To access the full response (for headers, for example), `challengelocationsList$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  challengelocationsList(params?: {

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

    return this.challengelocationsList$Response(params,context).pipe(
      map((r: StrictHttpResponse<PaginatedChallengeLocationList>) => r.body as PaginatedChallengeLocationList)
    );
  }

  /**
   * Path part for operation challengelocationsGuessesList
   */
  static readonly ChallengelocationsGuessesListPath = '/api/challengelocations/{challengelocation_pk}/guesses/';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `challengelocationsGuessesList()` instead.
   *
   * This method doesn't expect any request body.
   */
  challengelocationsGuessesList$Response(params: {

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

    const rb = new RequestBuilder(this.rootUrl, ChallengelocationsService.ChallengelocationsGuessesListPath, 'get');
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
   * To access the full response (for headers, for example), `challengelocationsGuessesList$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  challengelocationsGuessesList(params: {

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

    return this.challengelocationsGuessesList$Response(params,context).pipe(
      map((r: StrictHttpResponse<PaginatedGuessList>) => r.body as PaginatedGuessList)
    );
  }

  /**
   * Path part for operation challengelocationsGuessesCreate
   */
  static readonly ChallengelocationsGuessesCreatePath = '/api/challengelocations/{challengelocation_pk}/guesses/';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `challengelocationsGuessesCreate$Json()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  challengelocationsGuessesCreate$Json$Response(params: {

    /**
     * ID of the Challenge Location resource
     */
    challengelocation_pk: number;
    body: Guess
  },
  context?: HttpContext

): Observable<StrictHttpResponse<Guess>> {

    const rb = new RequestBuilder(this.rootUrl, ChallengelocationsService.ChallengelocationsGuessesCreatePath, 'post');
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
   * To access the full response (for headers, for example), `challengelocationsGuessesCreate$Json$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  challengelocationsGuessesCreate$Json(params: {

    /**
     * ID of the Challenge Location resource
     */
    challengelocation_pk: number;
    body: Guess
  },
  context?: HttpContext

): Observable<Guess> {

    return this.challengelocationsGuessesCreate$Json$Response(params,context).pipe(
      map((r: StrictHttpResponse<Guess>) => r.body as Guess)
    );
  }

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `challengelocationsGuessesCreate$XWwwFormUrlencoded()` instead.
   *
   * This method sends `application/x-www-form-urlencoded` and handles request body of type `application/x-www-form-urlencoded`.
   */
  challengelocationsGuessesCreate$XWwwFormUrlencoded$Response(params: {

    /**
     * ID of the Challenge Location resource
     */
    challengelocation_pk: number;
    body: Guess
  },
  context?: HttpContext

): Observable<StrictHttpResponse<Guess>> {

    const rb = new RequestBuilder(this.rootUrl, ChallengelocationsService.ChallengelocationsGuessesCreatePath, 'post');
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
   * To access the full response (for headers, for example), `challengelocationsGuessesCreate$XWwwFormUrlencoded$Response()` instead.
   *
   * This method sends `application/x-www-form-urlencoded` and handles request body of type `application/x-www-form-urlencoded`.
   */
  challengelocationsGuessesCreate$XWwwFormUrlencoded(params: {

    /**
     * ID of the Challenge Location resource
     */
    challengelocation_pk: number;
    body: Guess
  },
  context?: HttpContext

): Observable<Guess> {

    return this.challengelocationsGuessesCreate$XWwwFormUrlencoded$Response(params,context).pipe(
      map((r: StrictHttpResponse<Guess>) => r.body as Guess)
    );
  }

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `challengelocationsGuessesCreate$FormData()` instead.
   *
   * This method sends `multipart/form-data` and handles request body of type `multipart/form-data`.
   */
  challengelocationsGuessesCreate$FormData$Response(params: {

    /**
     * ID of the Challenge Location resource
     */
    challengelocation_pk: number;
    body: Guess
  },
  context?: HttpContext

): Observable<StrictHttpResponse<Guess>> {

    const rb = new RequestBuilder(this.rootUrl, ChallengelocationsService.ChallengelocationsGuessesCreatePath, 'post');
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
   * To access the full response (for headers, for example), `challengelocationsGuessesCreate$FormData$Response()` instead.
   *
   * This method sends `multipart/form-data` and handles request body of type `multipart/form-data`.
   */
  challengelocationsGuessesCreate$FormData(params: {

    /**
     * ID of the Challenge Location resource
     */
    challengelocation_pk: number;
    body: Guess
  },
  context?: HttpContext

): Observable<Guess> {

    return this.challengelocationsGuessesCreate$FormData$Response(params,context).pipe(
      map((r: StrictHttpResponse<Guess>) => r.body as Guess)
    );
  }

  /**
   * Path part for operation challengelocationsGuessesRetrieve
   */
  static readonly ChallengelocationsGuessesRetrievePath = '/api/challengelocations/{challengelocation_pk}/guesses/{id}/';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `challengelocationsGuessesRetrieve()` instead.
   *
   * This method doesn't expect any request body.
   */
  challengelocationsGuessesRetrieve$Response(params: {

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

    const rb = new RequestBuilder(this.rootUrl, ChallengelocationsService.ChallengelocationsGuessesRetrievePath, 'get');
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
   * To access the full response (for headers, for example), `challengelocationsGuessesRetrieve$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  challengelocationsGuessesRetrieve(params: {

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

    return this.challengelocationsGuessesRetrieve$Response(params,context).pipe(
      map((r: StrictHttpResponse<Guess>) => r.body as Guess)
    );
  }

  /**
   * Path part for operation challengelocationsRetrieve
   */
  static readonly ChallengelocationsRetrievePath = '/api/challengelocations/{id}/';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `challengelocationsRetrieve()` instead.
   *
   * This method doesn't expect any request body.
   */
  challengelocationsRetrieve$Response(params: {

    /**
     * A unique integer value identifying this challenge location.
     */
    id: number;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<ChallengeLocation>> {

    const rb = new RequestBuilder(this.rootUrl, ChallengelocationsService.ChallengelocationsRetrievePath, 'get');
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
   * To access the full response (for headers, for example), `challengelocationsRetrieve$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  challengelocationsRetrieve(params: {

    /**
     * A unique integer value identifying this challenge location.
     */
    id: number;
  },
  context?: HttpContext

): Observable<ChallengeLocation> {

    return this.challengelocationsRetrieve$Response(params,context).pipe(
      map((r: StrictHttpResponse<ChallengeLocation>) => r.body as ChallengeLocation)
    );
  }

}
