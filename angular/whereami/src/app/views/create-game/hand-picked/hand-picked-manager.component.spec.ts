import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HandPickedManagerComponent } from './hand-picked-manager.component';

describe('HandPickedComponent', () => {
  let component: HandPickedManagerComponent;
  let fixture: ComponentFixture<HandPickedManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HandPickedManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HandPickedManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
