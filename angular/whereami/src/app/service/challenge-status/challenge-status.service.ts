import {Injectable} from '@angular/core';
import {ChallengeStatus} from "../../model/status/challenge-status";
import {BehaviorSubject, delayWhen, Observable, of, timer} from "rxjs";
import {UserChallengeStatus} from "../../model/status/user-challenge-status";
import {webSocket, WebSocketSubject} from "rxjs/webSocket";
import {UserService} from "../user/user.service";
import {ChallengeStatusEvent, StatusEventType} from "../../model/status/challenge-status-event";
import {User} from "../user/user";

//typescript do be like that
export type BoundChallengeStatusService = typeof ChallengeStatusService.BoundChallengeStatusService.prototype

const PUBLISH_DELAY_SECONDS: number = 0.5;
@Injectable({
  providedIn: 'root'
})
export class ChallengeStatusService {

  constructor(private userService: UserService) {
    //TODO auth via jwt
  }

  public bind(id: number) : BoundChallengeStatusService {
    return new ChallengeStatusService.BoundChallengeStatusService(this, id)
  }

  private getWebSocket(challengeId: number): WebSocketSubject<ChallengeStatusEvent> {
    //TODO fix ws vs wss
    return webSocket<ChallengeStatusEvent>(`${this.protocol()}//${window.location.hostname}/ws/challenge/${challengeId}/?token=${
      this.userService.token}`)
  }

  private protocol() {
    return window.location.protocol == "http:" ? "ws:" : "wss:";
  }

  static BoundChallengeStatusService = class {
    public get statuses(): ReadonlyMap<string, UserChallengeStatus> {
      return this._statuses;
    }
    private last_resync: number = 0;
    private readonly socket: WebSocketSubject<ChallengeStatusEvent>;
    private _statuses: Map<string, UserChallengeStatus> = new Map<string, UserChallengeStatus>()
    private own_status: ChallengeStatus | undefined;
    private _statusBehaviourSubject: BehaviorSubject<Map<string, UserChallengeStatus>> = new BehaviorSubject(this._statuses);

    constructor(private readonly parent: ChallengeStatusService, private readonly id: number) {
      this.socket = parent.getWebSocket(id)
      this.socket.subscribe(value => this.processUpdate(value))
    }

    private processUpdate(event: ChallengeStatusEvent) {
      switch (event.type) {
        case StatusEventType.RESYNC:
          this.processResync(event)
          break
        case StatusEventType.CLIENT_UPDATE:
          this.processClientUpdate(event)
          break
      }
    }

    public postStatus(status: ChallengeStatus): void {
      this.own_status = status
      //TODO find a more suitable type-"safe" "implementation for this
      // @ts-ignore
      this.socket.next({user_data: status, sync_time: this.last_resync})
    }

    private processResync(event: ChallengeStatusEvent) {
      if(event.sync_time > this.last_resync) {
        this.last_resync = event.sync_time
        this._statuses.clear()
        this.updateStatusObservable()
        if (this.own_status) {
          //TODO find a more suitable type-"safe" "implementation for this
          // @ts-ignore
          this.socket.next({user_data: this.own_status, sync_time: this.last_resync})
        }
      }
    }

    private processClientUpdate(event: ChallengeStatusEvent) {
      this._statuses.set(event.username, {username: event.username, status: event.user_data.status, round: event.user_data.round})
      this.updateStatusObservable()
    }

    private updateStatusObservable() {
      this._statusBehaviourSubject.next(this._statuses)
    }

    get statusObservable(): Observable<Map<string, UserChallengeStatus>> {
      return this._statusBehaviourSubject.pipe(delayWhen(() => timer(this.calculateDelay())));
    }

    private calculateDelay(): number {
      let now = new Date()  
      let utcMilllisecondsSinceEpoch = now.getTime() + (now.getTimezoneOffset() * 60 * 1000)  
      let utcSecondsSinceEpoch = Math.round(utcMilllisecondsSinceEpoch / 1000)  
      return Math.max(0, (this.last_resync + PUBLISH_DELAY_SECONDS) - utcSecondsSinceEpoch);
    }
  }

}


