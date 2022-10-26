import { HttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GOOGLE_TESTING_PROVIDER } from 'src/app/Test/testutils.spec';

import { RoundMapComponent } from './round-map.component';

describe('RoundMapComponent', () => {
  let component: RoundMapComponent;
  let fixture: ComponentFixture<RoundMapComponent>;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(async () => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    await TestBed.configureTestingModule({
      declarations: [ RoundMapComponent ],
      providers: [
        {provide: HttpClient, useValue: httpClientSpy},
        GOOGLE_TESTING_PROVIDER]
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
