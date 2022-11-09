import { HttpClient, HttpClientModule, HttpClientXsrfModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  HttpClientTestingModule, HttpTestingController
} from '@angular/common/http/testing';
import { MockBuilder, MockRender, ngMocks, NG_MOCKS_INTERCEPTORS } from 'ng-mocks';

import { catchError } from 'rxjs';
import { AppModule } from '../app.module';
import { UnauthorizedInterceptor } from './unauthorized-interceptor';
import { UserService } from './user/user.service';


describe('UnauthorizedInterceptor', () => {
  beforeEach(() => {
    // move to test.ts later
    ngMocks.autoSpy('jasmine');
    return MockBuilder(UnauthorizedInterceptor, AppModule)
      .exclude(NG_MOCKS_INTERCEPTORS)
      .keep(HTTP_INTERCEPTORS)
      .exclude(HttpClientXsrfModule)
      .replace(HttpClientModule, HttpClientTestingModule);
  });

  it('should be created', () => {
    MockRender();
    const userService = ngMocks.findInstance(UserService);

    const client = ngMocks.findInstance(HttpClient);
    const httpMock = ngMocks.findInstance(HttpTestingController);
    client.get('/any').pipe(catchError(err => [])).subscribe();
    httpMock.expectOne('/any').flush('', {status: 401, statusText:'Unauthorized'});

    expect(userService.logout).toHaveBeenCalled();
  });
});
