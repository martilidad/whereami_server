/* tslint:disable */
/* eslint-disable */
import { Game } from './game';
export interface PaginatedGameList {
  count?: number;
  next?: null | string;
  previous?: null | string;
  results?: Array<Game>;
}
