import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HandPickedComponent } from './hand-picked.component';

describe('HandPickedComponent', () => {
  let component: HandPickedComponent;
  let fixture: ComponentFixture<HandPickedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HandPickedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HandPickedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
