import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { HttpErrorHandler } from 'src/app/http-error-handler.service';

import { ScoreService } from './score.service';

describe('ScoreService', () => {
  let service: ScoreService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let httpErrorHandlerSpy: jasmine.SpyObj<HttpErrorHandler>;



  beforeEach(() => {
    httpErrorHandlerSpy = jasmine.createSpyObj('HttpErrorHandler', [
      'createHandleError',
    ]);
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: HttpErrorHandler, useValue: httpErrorHandlerSpy },
      ],
    });
    service = TestBed.inject(ScoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
