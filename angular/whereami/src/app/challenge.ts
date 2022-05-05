import {Game} from "./game";

export interface Challenge {
  id: number,
  // todo proper date object
  pub_date: Date,
  location_count: number,
  time: number,
  name: string,
  //only name at the moment
  game: Game
}
