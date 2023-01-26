import {Game} from "./game";
import {Moment} from 'moment';
import { ChallengeLocation } from "./challenge-location";

export interface Challenge {
  id: number,
  // todo proper date object
  pub_date: string,
  location_count: number,
  time: number,
  name: string,
  //only name at the moment
  game: Game,
  challengelocation_set: [ChallengeLocation]
}
