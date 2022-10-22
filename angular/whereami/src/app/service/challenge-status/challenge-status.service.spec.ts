
import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { WebSocketServiceSpy } from 'src/app/Test/testutils.spec';
import { UserService } from '../user/user.service';

import { ChallengeStatusService } from './challenge-status.service';
import { WebSocketFactoryService } from './web-socket-factory.service';

describe('ChallengeStatusService', () => {
  let service: ChallengeStatusService;
  let userService: UserService;
  let fakeSocket: Subject<any>; // Exposed so we can spy on it and simulate server messages

  beforeEach(() => {
    const fakeSocketFactory = jasmine.createSpyObj(WebSocketFactoryService, ['webSocket']);
    fakeSocketFactory.webSocket.and.callFake(() => fakeSocket);
    userService = jasmine.createSpyObj('UserService', [], ['token'])
    service = new ChallengeStatusService(userService, fakeSocketFactory)
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
