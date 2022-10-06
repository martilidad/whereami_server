import {ChallengeLocation} from "./challenge-location";
import {Guess} from "./guess";

export interface PlayedChallengeLocation {
  guesses: Guess[],
  location: ChallengeLocation
}
