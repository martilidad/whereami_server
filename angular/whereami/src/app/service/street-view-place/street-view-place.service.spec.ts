import { TestBed } from '@angular/core/testing';
import { GOOGLE_TESTING_PROVIDER } from 'src/app/Test/testutils.spec';

import { StreetViewPlaceService } from './street-view-place.service';

describe('StreetViewPlaceService', () => {
  let service: StreetViewPlaceService;

  beforeEach(() => {
    TestBed.configureTestingModule({providers: [GOOGLE_TESTING_PROVIDER]});
    service = TestBed.inject(StreetViewPlaceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
