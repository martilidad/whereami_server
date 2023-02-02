/* tslint:disable */
/* eslint-disable */
export interface Guess {
  distance: number;
  id: null | number;
  lat: number;
  long: number;
  pub_date: null | string;
  score: number;

  /**
   * Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.
   */
  username: string;
}
