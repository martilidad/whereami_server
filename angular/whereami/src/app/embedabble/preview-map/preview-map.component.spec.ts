import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewMapComponent } from './preview-map.component';

describe('PreviewMapComponent', () => {
  let component: PreviewMapComponent;
  let fixture: ComponentFixture<PreviewMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewMapComponent ]
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
