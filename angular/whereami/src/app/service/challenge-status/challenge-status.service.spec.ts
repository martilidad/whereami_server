import { TestBed } from '@angular/core/testing';

import { ChallengeStatusService } from './challenge-status.service';

describe('ChallengeStatusServiceService', () => {
  let service: ChallengeStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChallengeStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
