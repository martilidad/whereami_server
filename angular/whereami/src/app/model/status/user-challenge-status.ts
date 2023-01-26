import {ChallengeStatus} from "./challenge-status";

export interface UserChallengeStatus extends ChallengeStatus {
  username: string,
  sync_time: number
}
