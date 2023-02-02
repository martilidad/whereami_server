import { HttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { HttpErrorHandler } from 'src/app/http-error-handler.service';
import { Game } from '@client/models';
import { GamesService } from 'src/app/service/game/games.service';

import { HomeChallengeFormComponent } from './home-challenge-form.component';

describe('HomeChallengeFormComponent', () => {
  let component: HomeChallengeFormComponent;
  let fixture: ComponentFixture<HomeChallengeFormComponent>;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let httpErrorHandlerSpy: jasmine.SpyObj<HttpErrorHandler>;
  let gamesServiceSpy: jasmine.SpyObj<GamesService>;
  let observableSpy: jasmine.SpyObj<Observable<Game[]>>;

  beforeEach(async () => {
    httpErrorHandlerSpy = jasmine.createSpyObj('HttpErrorHandler', [
      'createHandleError',
    ]);
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    gamesServiceSpy = jasmine.createSpyObj('GamesService', ['getGames']);
    observableSpy = jasmine.createSpyObj('Observable', ['subscribe']);
    gamesServiceSpy.getGames.and.returnValue(observableSpy);
    await TestBed.configureTestingModule({
      declarations: [ HomeChallengeFormComponent ],
      providers: [
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: HttpErrorHandler, useValue: httpErrorHandlerSpy },
        { provide: GamesService, useValue: gamesServiceSpy}
      ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeChallengeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
