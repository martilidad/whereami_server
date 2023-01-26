import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GoogleMapStubComponent, GOOGLE_MAP_STUB, GOOGLE_TESTING_PROVIDER } from 'src/app/test/testutils.spec';

import { CoverageToggleComponent } from './coverage-toggle.component';

describe('CoverageToggleComponent', () => {
  let component: CoverageToggleComponent;
  let fixture: ComponentFixture<CoverageToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoverageToggleComponent],
      providers: [GOOGLE_TESTING_PROVIDER, GOOGLE_MAP_STUB]
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
