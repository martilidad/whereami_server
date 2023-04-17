import { Challenge, ChallengeLocation, Location } from '@client/models';
import { MockBuilder, MockInstance, MockRender } from 'ng-mocks';
import { Observable, of } from 'rxjs';
import { AppModule } from 'src/app/app.module';
import { ChallengesService } from 'src/app/service/challenge/challenges.service';
import { GOOGLE_TESTING_PROVIDER } from 'src/app/test/testutils.spec';

import { HomeComponent } from './home.component';

describe('HomeComponent', () => {

  beforeEach(() => {
    return MockBuilder(HomeComponent, AppModule)
    .provide(GOOGLE_TESTING_PROVIDER);
  });

  beforeEach(()=> MockInstance(ChallengesService, 'getChallenges', n => 
  of([{id: 3, game: {id: 1, locations: [] as Location[], name: 'test'}, pub_date: '2022-11-20T12:42Z', locations: [] as ChallengeLocation[]}]) as Observable<Challenge[]>))

  it('should create', () => {
    const fixture = MockRender(HomeComponent)
    expect(fixture).toBeTruthy();
  });
});
