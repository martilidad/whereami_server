import {Score} from "./score";
import {PlayedChallengeLocation} from "./played-challenge-location";

export interface ChallengeOverview {

  scores: Score[]
  winner: string
  id: number
  challenge_locations: PlayedChallengeLocation[]
}
