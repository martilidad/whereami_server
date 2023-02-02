import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChallengeOverviewComponent } from './challenge-overview.component';
import {ChallengesService} from "../../service/challenge/challenges.service";
import {Observable, of} from "rxjs";
import {Challenge, ChallengeLocation, ChallengeScore, Location} from "@client/models";
import {ActivatedRoute, Params} from "@angular/router";

describe('ChallengeOverviewComponent', () => {
  let id = 0;
  let component: ChallengeOverviewComponent;
  let fixture: ComponentFixture<ChallengeOverviewComponent>;
  let challengeOverviewStub: Partial<ChallengesService> = {
    getChallenge(id: number): Observable<Challenge> {
      return of<Challenge>({id: 3, game: {id: 1, locations: [] as Location[], name: 'test'}, pub_date: '2022-11-20T12:42Z', locations: [] as ChallengeLocation[], scores: [] as ChallengeScore[], time: 19})
    }
  }
  let activatedRouteStub: Partial<ActivatedRoute> = {
    queryParams: of<Params>({id: id})
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChallengeOverviewComponent ],
      providers: [{provide: ChallengesService, useValue: challengeOverviewStub},
        {provide: ActivatedRoute, useValue: activatedRouteStub}]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChallengeOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
