/* tslint:disable */
/* eslint-disable */
import { ChallengeLocation } from './challenge-location';
import { ChallengeScore } from './challenge-score';
import { Game } from './game';
export interface Challenge {
  game: Game;
  id: null | number;
  locations: Array<ChallengeLocation>;
  pub_date: null | string;
  scores: Array<ChallengeScore>;
  time: number;
}
