import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawnGameFormComponent } from './drawn-game-form.component';

describe('CreateDrawnGameComponent', () => {
  let component: DrawnGameFormComponent;
  let fixture: ComponentFixture<DrawnGameFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrawnGameFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawnGameFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
