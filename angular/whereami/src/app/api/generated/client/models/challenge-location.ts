/* tslint:disable */
/* eslint-disable */
import { Guess } from './guess';
export interface ChallengeLocation {
  guessed: boolean;
  guesses: Array<Guess>;
  id: null | number;
  lat: number;
  long: number;
  name: string;
}
