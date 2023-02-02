import { HttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { HttpErrorHandler } from 'src/app/http-error-handler.service';
import { Challenge } from '@client/models';
import { ChallengesService } from 'src/app/service/challenge/challenges.service';

import { IndexComponent } from './index.component';

describe('IndexComponent', () => {
  let component: IndexComponent;
  let fixture: ComponentFixture<IndexComponent>;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let httpErrorHandlerSpy: jasmine.SpyObj<HttpErrorHandler>;
  let challengeServiceSpy: jasmine.SpyObj<ChallengesService>;
  let observableSpy: jasmine.SpyObj<Observable<Challenge[]>>;

  beforeEach(async () => {
    httpErrorHandlerSpy = jasmine.createSpyObj('HttpErrorHandler', [
      'createHandleError',
    ]);
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    challengeServiceSpy = jasmine.createSpyObj('ChallengesService', ['getChallenges']);
    observableSpy = jasmine.createSpyObj('Observable', ['subscribe']);
    challengeServiceSpy.getChallenges.and.returnValue(observableSpy);
    await TestBed.configureTestingModule({
      declarations: [ IndexComponent ],
      providers: [
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: HttpErrorHandler, useValue: httpErrorHandlerSpy },
        // TODO why does this provider not work??????? see challenge-form component
        { provide: ChallengesService, useValue: challengeServiceSpy}
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
