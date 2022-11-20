import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockBuilder, MockInstance, MockRender, ngMocks } from 'ng-mocks';
import { Observable, of } from 'rxjs';
import { AppModule } from 'src/app/app.module';
import { RuntimeChallenge } from 'src/app/model/game-model/runtime-challenge';
import { LatLng } from 'src/app/model/lat-lng';
import { ChallengesService } from 'src/app/service/challenge/challenges.service';
import { GOOGLE_TESTING_PROVIDER } from 'src/app/test/testutils.spec';

import { HomeComponent } from './home.component';

describe('HomeComponent', () => {

  beforeEach(() => {
    return MockBuilder(HomeComponent, AppModule)
    .provide(GOOGLE_TESTING_PROVIDER);
  });

  beforeEach(()=> MockInstance(ChallengesService, 'getRuntimeChallenges', n => 
  of([{id: 3, game: {locations: [] as LatLng[]}, pub_date: '2022-11-20T12:42Z'}]) as Observable<RuntimeChallenge[]>))

  it('should create', () => {
    const fixture = MockRender(HomeComponent)
    expect(fixture).toBeTruthy();
  });
});
