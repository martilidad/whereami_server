import { Subject } from 'rxjs';
import {
  ChallengeStatusEvent,
  StatusEventType
} from 'src/app/model/status/challenge-status-event';
import { PlayStatus } from 'src/app/model/status/play-status';
import {
  assertEmitions
} from 'src/app/test/testutils.spec';
import { UserService } from '../user/user.service';

import { ChallengeStatusService } from './challenge-status.service';

describe('ChallengeStatusService', () => {
  let fixture: ChallengeStatusService;
  let userService: UserService;
  let fakeSocket: Subject<Partial<ChallengeStatusEvent>>; // Exposed so we can spy on it and simulate server messages

  beforeEach(() => {
    fakeSocket = new Subject<Partial<ChallengeStatusEvent>>();
    const fakeSocketFactory = jasmine.createSpyObj('WebSocketFactoryService', [
      'webSocket',
    ]);
    fakeSocketFactory.webSocket.and.callFake(() => fakeSocket);
    userService = jasmine.createSpyObj('UserService', [], ['token']);
    fixture = new ChallengeStatusService(userService, fakeSocketFactory);
  });

  it('should be created', () => {
    expect(fixture).toBeTruthy();
  });

  it('should send messages', (done) => {
    fakeSocket.subscribe((event) => {
      expect(event.user_data!.round).toEqual(1);
      expect(event.user_data!.status).toEqual(PlayStatus.PLAYING);
      done();
    });
    fixture.bind(0).postStatus({ status: PlayStatus.PLAYING, round: 1 });
  });

  it('should receive messages', () => {
    const boundService = fixture.bind(0);
    const sync_time = new Date().getTime() / 1000;
    fakeSocket.next({
      id: 0,
      sync_time: sync_time,
      type: StatusEventType.CLIENT_UPDATE,
      user_data: { status: PlayStatus.PLAYING, round: 1 },
      username: 'user',
    });
    expect(boundService.statuses.get('user')).toEqual({
      round: 1,
      status: PlayStatus.PLAYING,
      sync_time: sync_time,
      username: 'user',
    });
    expect(boundService.statuses.size).toEqual(1);
  });

  it('should send resync', (done) => {
    const sync_time = new Date().getTime() / 1000;
    assertEmitions(
      fakeSocket,
      [
        {
          sync_time: 0,
          user_data: {
            round: 1,
            status: PlayStatus.PLAYING
          }
        },
        {
          id: 0,
          sync_time: sync_time,
          type: StatusEventType.RESYNC,
        },
        {
          sync_time: sync_time,
          user_data: {
            round: 1,
            status: PlayStatus.PLAYING
          }
        },
      ],
      done
    );
    // user sends an update
    fixture.bind(0).postStatus({ status: PlayStatus.PLAYING, round: 1 });
    // server sends a resync
    fakeSocket.next({
      id: 0,
      sync_time: sync_time,
      type: StatusEventType.RESYNC,
    });
  });
});
