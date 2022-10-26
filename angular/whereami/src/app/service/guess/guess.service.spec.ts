import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { HttpErrorHandler } from 'src/app/http-error-handler.service';
import { UserService } from '../user/user.service';

import { GuessService } from './guess.service';

describe('GuessService', () => {
  let service: GuessService;
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
    service = TestBed.inject(GuessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
