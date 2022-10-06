import {ChallengeStatus} from "./challenge-status";

export enum StatusEventType {
  CLIENT_UPDATE = 'client_update',
  RESYNC = 'resync'

}

export interface ChallengeStatusEvent {
  //only property that may be sent by the client
  user_data: ChallengeStatus
  //set by the server on resync
  sync_time: number
  //all set by the server
  type: StatusEventType
  username: string
  //channel name; used in BE only
  id: string | undefined
}
