import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GOOGLE_TESTING_PROVIDER } from 'src/app/test/testutils.spec';

import { PreviewMapComponent } from './preview-map.component';

describe('PreviewMapComponent', () => {
  let component: PreviewMapComponent;
  let fixture: ComponentFixture<PreviewMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewMapComponent ],
      providers: [GOOGLE_TESTING_PROVIDER]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreviewMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
