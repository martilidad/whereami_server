import { Challenge, ChallengeLocation, Guess } from '@client/models';
import { LatLng } from '../lat-lng';
import { BoundChallengeStatusService } from '@service/challenge-status/challenge-status.service';

export class RoundState {
  index: number|null;
  score: number = 0;
  scoreHidden: number = 0;
  distance: number = 0;
  distanceHidden: number = 0;
  remainingTime: number;
  //TODO merge these two; just create the guess object prematurely
  guess: google.maps.LatLng | undefined;
  duplicateGuessMarker: Guess | undefined
  ended: boolean = false;

  constructor(index: number|null, time: number) {
    this.index = index;
    this.remainingTime = time;
  }
}

export class GameState {
  finished: boolean = false;
  playedBefore: boolean = false;
  round: RoundState;
  score: number = 0;
  distance: number = 0;
  challenge: Challenge| null
  statusWorker: BoundChallengeStatusService | undefined

  //TODO this is only null so it can easily be constructed for initial state :/
  constructor(round: RoundState, challenge: Challenge| null) {
    this.challenge = challenge
    this.round = round;
  }
}
