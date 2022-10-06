import { TestBed } from '@angular/core/testing';

import { ChallengeOverviewService } from './challenge-overview.service';

describe('ChallengeOverviewService', () => {
  let service: ChallengeOverviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChallengeOverviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
