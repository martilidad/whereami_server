import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HandpickedGameFormComponent } from './handpicked-game-form.component';

describe('HandpickedGameFormComponent', () => {
  let component: HandpickedGameFormComponent;
  let fixture: ComponentFixture<HandpickedGameFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HandpickedGameFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HandpickedGameFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
