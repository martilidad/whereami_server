import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoverageToggleComponent } from './coverage-toggle.component';

describe('CoverageToggleComponent', () => {
  let component: CoverageToggleComponent;
  let fixture: ComponentFixture<CoverageToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoverageToggleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoverageToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
