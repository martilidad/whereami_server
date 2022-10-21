import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GOOGLE_TESTING_PROVIDER } from 'src/app/Test/web-socket-service-spy.spec';

import { GamePanoComponent } from './game-pano.component';

describe('GamePanoComponent', () => {
  let component: GamePanoComponent;
  let fixture: ComponentFixture<GamePanoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GamePanoComponent ],
      providers: [GOOGLE_TESTING_PROVIDER]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GamePanoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
