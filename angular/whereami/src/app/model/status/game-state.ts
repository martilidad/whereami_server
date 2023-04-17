import { ChallengeLocation } from "@client/models";
import { LatLngImpl } from "../lat-lng";

export class RoundState {
  index: number = 0
  score: number = 0
  distance: number = 0
  remainingTime: number
  guess: LatLngImpl | undefined

  constructor(index: number, time: number) {
    this.index = index
    this.remainingTime = time
  }
}

export class GameState {
  finished: boolean = false
  playedBefore: boolean = false
  round: RoundState
  score: number = 0
  distance: number = 0

  constructor(round: RoundState) {
    this.round = round
  }

  updateScore(distance: number, score: number) {
    this.score += score
    this.distance += distance
    this.round.score = score
    this.round.distance = distance
  }
}
