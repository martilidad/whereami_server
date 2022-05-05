import { TestBed } from '@angular/core/testing';

import { StreetViewPlaceService } from './street-view-place.service';

describe('StreetViewPlaceService', () => {
  let service: StreetViewPlaceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StreetViewPlaceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
