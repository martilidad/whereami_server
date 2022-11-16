import {ChallengeStatus} from "./challenge-status";

export enum StatusEventType {
  CLIENT_UPDATE = 'client_update',
  RESYNC = 'resync',
  GHOST_UPDATE = 'ghost_update'
}

export interface ChallengeStatusEvent {
  //property sent on CLIENT_UPDATE
  user_data: ChallengeStatus
  //property sent on GHOST_UPDATE
  location: google.maps.LatLng | undefined
  //set by the server on resync
  sync_time: number
  //all set by the server
  type: StatusEventType
  username: string
  //channel name; used in BE only
  id: number | undefined,
}
