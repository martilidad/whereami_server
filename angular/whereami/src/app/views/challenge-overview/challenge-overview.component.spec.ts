import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChallengeOverviewComponent } from './challenge-overview.component';
import {ChallengeOverviewService} from "../../service/challenge-overview/challenge-overview.service";
import {UserService} from "../../service/user/user.service";
import {Observable, of} from "rxjs";
import {ChallengeOverview} from "../../model/game-model/challenge-overview";
import {ActivatedRoute, Params} from "@angular/router";

describe('ChallengeOverviewComponent', () => {
  let id = 0;
  let component: ChallengeOverviewComponent;
  let fixture: ComponentFixture<ChallengeOverviewComponent>;
  let challengeOverviewStub: Partial<ChallengeOverviewService> = {
    getOverview(id: number): Observable<ChallengeOverview | undefined> {
      return of<ChallengeOverview>({challenge_locations: [], id: id, scores: [], winner: 'aname'})
    }
  }
  let activatedRouteStub: Partial<ActivatedRoute> = {
    queryParams: of<Params>({id: id})
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChallengeOverviewComponent ],
      providers: [{provide: ChallengeOverviewService, useValue: challengeOverviewStub},
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
