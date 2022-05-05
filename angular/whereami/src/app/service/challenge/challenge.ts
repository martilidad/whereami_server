import {Game} from "../game/game";
import {Moment} from 'moment';

export interface Challenge {
  id: number,
  // todo proper date object
  pub_date: Moment,
  location_count: number,
  time: number,
  name: string,
  //only name at the moment
  game: Game
}
