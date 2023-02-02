/* tslint:disable */
/* eslint-disable */
import { Challenge } from './challenge';
export interface PaginatedChallengeList {
  count?: number;
  next?: null | string;
  previous?: null | string;
  results?: Array<Challenge>;
}
