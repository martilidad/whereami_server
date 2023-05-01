import { HttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GOOGLE_TESTING_PROVIDER } from '../../../test/testutils.spec';

import { OverviewMapComponent } from './overview-map.component';

describe('OverviewMapComponent', () => {
  let component: OverviewMapComponent;
  let fixture: ComponentFixture<OverviewMapComponent>;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(async () => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    await TestBed.configureTestingModule({
      declarations: [ OverviewMapComponent ],
      providers: [
        {provide: HttpClient, useValue: httpClientSpy},
        GOOGLE_TESTING_PROVIDER]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OverviewMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
