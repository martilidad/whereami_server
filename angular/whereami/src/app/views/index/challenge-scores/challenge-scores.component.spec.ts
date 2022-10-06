import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChallengeScoresComponent } from './challenge-scores.component';

describe('ChallengeScoresComponent', () => {
  let component: ChallengeScoresComponent;
  let fixture: ComponentFixture<ChallengeScoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChallengeScoresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChallengeScoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
