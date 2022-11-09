import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GoogleMapStubComponent, GOOGLE_MAP_STUB, GOOGLE_TESTING_PROVIDER } from 'src/app/test/testutils.spec';

import { MiniMapComponent } from './mini-map.component';

describe('MiniMapComponent', () => {
  let component: MiniMapComponent;
  let fixture: ComponentFixture<MiniMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MiniMapComponent, GoogleMapStubComponent ],
      providers: [GOOGLE_TESTING_PROVIDER]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MiniMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
