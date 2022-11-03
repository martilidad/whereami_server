import { HttpClient, HttpClientModule, HttpClientXsrfModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  HttpClientTestingModule, HttpTestingController
} from '@angular/common/http/testing';
import { MockBuilder, MockRender, ngMocks, NG_MOCKS_INTERCEPTORS } from 'ng-mocks';

import { catchError } from 'rxjs';
import { AppModule } from '../app.module';
import { ApiInterceptor } from './api-interceptor';


describe('ApiInterceptor', () => {
  beforeEach(() => {
    // move to test.ts later
    ngMocks.autoSpy('jasmine');
    return MockBuilder(ApiInterceptor, AppModule)
      .exclude(NG_MOCKS_INTERCEPTORS)
      .keep(HTTP_INTERCEPTORS)
      .exclude(HttpClientXsrfModule)
      .replace(HttpClientModule, HttpClientTestingModule);
  });

  it('should be created', () => {
    MockRender();

    const client = ngMocks.findInstance(HttpClient);
    const httpMock = ngMocks.findInstance(HttpTestingController);
    client.get('/any').pipe(catchError(err => [])).subscribe();
    // tests ckurrently run with the default environment and not environment.prod
    httpMock.expectOne('http://localhost:8000/any');
  });
});
