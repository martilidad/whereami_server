import {Inject, Injectable} from '@angular/core';
import {ChallengeStatus} from "../../model/status/challenge-status";
import {BehaviorSubject, map, Observable} from "rxjs";
import {UserChallengeStatus} from "../../model/status/user-challenge-status";
import {UserService} from "../user/user.service";
import {ChallengeStatusEvent, StatusEventType} from "../../model/status/challenge-status-event";
import { BACKEND_HOST } from 'src/environments/environment';
import { computeIfAbsent } from '../utils';
import { WebSocketFactoryService } from './web-socket-factory.service';
import { WebSocketSubject } from 'rxjs/webSocket';

//typescript do be like that
export type BoundChallengeStatusService = typeof ChallengeStatusService.BoundChallengeStatusService.prototype

const PUBLISH_DELAY_SECONDS: number = 2;
@Injectable({
  providedIn: 'root'
})
export class ChallengeStatusService {

  private bindingsMap: Map<number, BoundChallengeStatusService> = new Map();

  constructor(private userService: UserService, private wsFactory: WebSocketFactoryService) {}

  public bind(id: number) : BoundChallengeStatusService {
    return computeIfAbsent(this.bindingsMap, id, (id) => new ChallengeStatusService.BoundChallengeStatusService(this, id));
  }

  private getWebSocket(challengeId: number): WebSocketSubject<ChallengeStatusEvent> {
    return this.wsFactory.webSocket<ChallengeStatusEvent>(`${this.protocol}//${this.hostName}/ws/challenge/${challengeId}/?token=${
      this.userService.token}`)
  }

  private get protocol(): string {
    return window.location.protocol == "http:" ? "ws:" : "wss:";
  }

  private get hostName(): string {
    return BACKEND_HOST ? BACKEND_HOST : window.location.hostname;
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

    constructor(parent: ChallengeStatusService, id: number) {
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
        if (this.own_status) {
          //TODO find a more suitable type-"safe" "implementation for this
          // @ts-ignore
          this.socket.next({user_data: this.own_status, sync_time: this.last_resync})
        }
      }
    }

    private processClientUpdate(event: ChallengeStatusEvent) {
      this._statuses.set(event.username, {username: event.username, status: event.user_data.status, round: event.user_data.round, sync_time: event.sync_time})
      this.updateStatusObservable()
    }

    private updateStatusObservable() {
      this._statusBehaviourSubject.next(this._statuses)
    }

    get statusObservable(): Observable<Map<string, UserChallengeStatus>> {
      return this._statusBehaviourSubject
      .pipe(map(map => this.filterOldUsers(map)));
      // .pipe(delayWhen(() => timer(this.calculateDelay())));
    }

    private filterOldUsers(map: Map<string, UserChallengeStatus>): Map<string, UserChallengeStatus> {
      return new Map([...map.entries()].filter( it => it[1].sync_time >= this.last_resync - this.calculateDelay()));
    }

    // TODO is this really needed?
    private calculateDelay(): number {
      let now = new Date()  
      let utcMilllisecondsSinceEpoch = now.getTime() + (now.getTimezoneOffset() * 60 * 1000)  
      let utcSecondsSinceEpoch = Math.round(utcMilllisecondsSinceEpoch / 1000)  
      return Math.max(0, (this.last_resync + PUBLISH_DELAY_SECONDS) - utcSecondsSinceEpoch);
    }
  }

}


