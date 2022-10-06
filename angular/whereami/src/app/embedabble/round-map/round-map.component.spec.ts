import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundMapComponent } from './round-map.component';

describe('RoundMapComponent', () => {
  let component: RoundMapComponent;
  let fixture: ComponentFixture<RoundMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoundMapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoundMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
