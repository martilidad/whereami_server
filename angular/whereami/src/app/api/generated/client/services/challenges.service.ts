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
import { PaginatedChallengeList } from '../models/paginated-challenge-list';

@Injectable({
  providedIn: 'root',
})
export class ChallengesService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation challengesList
   */
  static readonly ChallengesListPath = '/api/challenges/';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `challengesList()` instead.
   *
   * This method doesn't expect any request body.
   */
  challengesList$Response(params?: {

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

    const rb = new RequestBuilder(this.rootUrl, ChallengesService.ChallengesListPath, 'get');
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
   * To access the full response (for headers, for example), `challengesList$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  challengesList(params?: {

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

    return this.challengesList$Response(params,context).pipe(
      map((r: StrictHttpResponse<PaginatedChallengeList>) => r.body as PaginatedChallengeList)
    );
  }

  /**
   * Path part for operation challengesRetrieve
   */
  static readonly ChallengesRetrievePath = '/api/challenges/{id}/';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `challengesRetrieve()` instead.
   *
   * This method doesn't expect any request body.
   */
  challengesRetrieve$Response(params: {

    /**
     * A unique integer value identifying this challenge.
     */
    id: number;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<Challenge>> {

    const rb = new RequestBuilder(this.rootUrl, ChallengesService.ChallengesRetrievePath, 'get');
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
   * To access the full response (for headers, for example), `challengesRetrieve$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  challengesRetrieve(params: {

    /**
     * A unique integer value identifying this challenge.
     */
    id: number;
  },
  context?: HttpContext

): Observable<Challenge> {

    return this.challengesRetrieve$Response(params,context).pipe(
      map((r: StrictHttpResponse<Challenge>) => r.body as Challenge)
    );
  }

}
