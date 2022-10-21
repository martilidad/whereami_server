import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GOOGLE_MAP_STUB, GOOGLE_TESTING_PROVIDER } from 'src/app/Test/web-socket-service-spy.spec';

import { DrawingManagerComponent } from './drawing-manager.component';

describe('DrawingManagerComponent', () => {
  let component: DrawingManagerComponent;
  let fixture: ComponentFixture<DrawingManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrawingManagerComponent ],
      providers: [GOOGLE_MAP_STUB, GOOGLE_TESTING_PROVIDER]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawingManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
