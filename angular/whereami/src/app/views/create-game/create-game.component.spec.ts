import { HttpClient } from '@angular/common/http';
import { DebugElement, Type } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { GoogleMap } from '@angular/google-maps';
import { By } from '@angular/platform-browser';
import { HttpErrorHandler } from 'src/app/http-error-handler.service';
import {
  GoogleMapStubComponent,
  GOOGLE_MAP_STUB,
  GOOGLE_TESTING_PROVIDER,
} from 'src/app/Test/testutils.spec';

import { CreateGameComponent } from './create-game.component';
import { DrawingManagerComponent } from './drawing-manager/drawing-manager.component';
import { DrawnGameFormComponent } from './drawn-game-form/drawn-game-form.component';
import { HandPickedManagerComponent } from './hand-picked/hand-picked-manager.component';
import { HandpickedGameFormComponent } from './handpicked-game-form/handpicked-game-form.component';

describe('CreateGameComponent', () => {
  let component: CreateGameComponent;
  let fixture: ComponentFixture<CreateGameComponent>;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let httpErrorHandlerSpy: jasmine.SpyObj<HttpErrorHandler>;

  beforeEach(async () => {
    httpErrorHandlerSpy = jasmine.createSpyObj('HttpErrorHandler', [
      'createHandleError',
    ]);
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    await TestBed.configureTestingModule({
      declarations: [
        CreateGameComponent,
        GoogleMapStubComponent,
        HandpickedGameFormComponent,
        HandPickedManagerComponent,
        DrawnGameFormComponent,
        DrawingManagerComponent,
      ],
      providers: [
        GOOGLE_TESTING_PROVIDER,
        GOOGLE_MAP_STUB,
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: HttpErrorHandler, useValue: httpErrorHandlerSpy },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be able to switch modes', (done) => {
    expect(component.handPicked).toBeFalsy();
    expect(fixture.debugElement.query(By.directive(HandpickedGameFormComponent)).nativeElement['hidden']).toBeTrue();
    expect(fixture.debugElement.query(By.directive(HandPickedManagerComponent)).componentInstance.hidden).toBeTrue();
    expect(fixture.debugElement.query(By.directive(DrawnGameFormComponent)).nativeElement['hidden']).toBeFalse();
    expect(fixture.debugElement.query(By.directive(DrawingManagerComponent)).componentInstance.hidden).toBeFalse();
    fixture.debugElement
      .query(By.css('#handPickedButton'))
      .nativeElement.click();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.handPicked).toBeTruthy();
      expect(fixture.debugElement.query(By.directive(HandpickedGameFormComponent)).nativeElement['hidden']).toBeFalse();
      expect(fixture.debugElement.query(By.directive(HandPickedManagerComponent)).componentInstance.hidden).toBeFalse();
      expect(fixture.debugElement.query(By.directive(DrawnGameFormComponent)).nativeElement['hidden']).toBeTrue();
      expect(fixture.debugElement.query(By.directive(DrawingManagerComponent)).componentInstance.hidden).toBeTrue();
      done();
    });
  });
});
