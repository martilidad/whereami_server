import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawingManagerComponent } from './drawing-manager.component';

describe('DrawingManagerComponent', () => {
  let component: DrawingManagerComponent;
  let fixture: ComponentFixture<DrawingManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrawingManagerComponent ]
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
