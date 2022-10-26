import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ApiInterceptor } from './api-interceptor';

let fixture: ApiInterceptor;

describe('ApiInterceptor', () => {
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    TestBed.configureTestingModule({providers: [ApiInterceptor, {provide: HttpClient, useValue: httpClientSpy}]});
    fixture = TestBed.inject(ApiInterceptor);
  })
  it('should create an instance', () => {
    expect(fixture).toBeTruthy();
  });
});
