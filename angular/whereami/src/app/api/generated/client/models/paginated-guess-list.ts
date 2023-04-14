/* tslint:disable */
/* eslint-disable */
import { Guess } from './guess';
export interface PaginatedGuessList {
  count?: number;
  next?: null | string;
  previous?: null | string;
  results?: Array<Guess>;
}
