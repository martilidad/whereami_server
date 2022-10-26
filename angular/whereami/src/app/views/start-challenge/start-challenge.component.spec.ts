import { HttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Params } from '@angular/router';
import { of } from 'rxjs';
import { HttpErrorHandler } from 'src/app/http-error-handler.service';
import { GOOGLE_TESTING_PROVIDER } from 'src/app/Test/testutils.spec';

import { StartChallengeComponent } from './start-challenge.component';

describe('StartChallangeComponent', () => {
  let component: StartChallengeComponent;
  let fixture: ComponentFixture<StartChallengeComponent>;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let httpErrorHandlerSpy: jasmine.SpyObj<HttpErrorHandler>;

  beforeEach(async () => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    httpErrorHandlerSpy = jasmine.createSpyObj('HttpErrorHandler', [
      'createHandleError',
    ]);
    let id = 0;
    let activatedRouteStub: Partial<ActivatedRoute> = {
      queryParams: of<Params>({id: id})
    }
    await TestBed.configureTestingModule({
      declarations: [ StartChallengeComponent ],
      providers: [
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: HttpErrorHandler, useValue: httpErrorHandlerSpy },
        {provide: ActivatedRoute, useValue: activatedRouteStub},
        GOOGLE_TESTING_PROVIDER]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StartChallengeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
