import { HttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { HttpErrorHandler } from 'src/app/http-error-handler.service';
import { Game } from 'src/app/model/game-model/game';
import { GamesService } from 'src/app/service/game/games.service';

import { ChallengeFormComponent } from './challenge-form.component';

describe('ChallengeFormComponent', () => {
  let component: ChallengeFormComponent;
  let fixture: ComponentFixture<ChallengeFormComponent>;
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
      declarations: [ ChallengeFormComponent ],
      providers: [
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: HttpErrorHandler, useValue: httpErrorHandlerSpy },
        { provide: GamesService, useValue: gamesServiceSpy}
      ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChallengeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
