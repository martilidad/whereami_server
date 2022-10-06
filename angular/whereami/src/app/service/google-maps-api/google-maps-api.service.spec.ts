import { TestBed } from '@angular/core/testing';

import { GoogleMapsApiService } from './google-maps-api.service';

describe('GoogleMapsApiService', () => {
  let service: GoogleMapsApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoogleMapsApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
