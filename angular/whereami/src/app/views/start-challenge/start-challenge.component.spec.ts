import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartChallengeComponent } from './start-challenge.component';

describe('StartChallangeComponent', () => {
  let component: StartChallengeComponent;
  let fixture: ComponentFixture<StartChallengeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StartChallengeComponent ]
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
