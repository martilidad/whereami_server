import { HttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpErrorHandler } from 'src/app/http-error-handler.service';
import {
  GOOGLE_MAP_STUB,
  GOOGLE_TESTING_PROVIDER,
} from 'src/app/Test/testutils.spec';

import { HandPickedManagerComponent } from './hand-picked-manager.component';

describe('HandPickedComponent', () => {
  let component: HandPickedManagerComponent;
  let fixture: ComponentFixture<HandPickedManagerComponent>;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let httpErrorHandlerSpy: jasmine.SpyObj<HttpErrorHandler>;

  beforeEach(async () => {
    httpErrorHandlerSpy = jasmine.createSpyObj('HttpErrorHandler', [
      'createHandleError',
    ]);
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    await TestBed.configureTestingModule({
      declarations: [HandPickedManagerComponent],
      providers: [
        GOOGLE_MAP_STUB,
        GOOGLE_TESTING_PROVIDER,
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: HttpErrorHandler, useValue: httpErrorHandlerSpy },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HandPickedManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
