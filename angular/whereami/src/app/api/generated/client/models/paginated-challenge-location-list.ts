/* tslint:disable */
/* eslint-disable */
import { ChallengeLocation } from './challenge-location';
export interface PaginatedChallengeLocationList {
  count?: number;
  next?: null | string;
  previous?: null | string;
  results?: Array<ChallengeLocation>;
}
