import {ChallengeLocation} from "./challenge-location";
import {LatLng} from "../lat-lng";

export interface RuntimeChallenge {
  Time: number,
  Challenge_Locations: ChallengeLocation[]
  Ignored_Count: number,
  Challenge_ID: number,
  boundary_array: LatLng[]

}
