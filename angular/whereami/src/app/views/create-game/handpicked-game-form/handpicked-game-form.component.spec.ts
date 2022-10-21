import { HttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpErrorHandler } from 'src/app/http-error-handler.service';

import { HandpickedGameFormComponent } from './handpicked-game-form.component';

describe('HandpickedGameFormComponent', () => {
  let component: HandpickedGameFormComponent;
  let fixture: ComponentFixture<HandpickedGameFormComponent>;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let httpErrorHandlerSpy: jasmine.SpyObj<HttpErrorHandler>;


  beforeEach(async () => {
    httpErrorHandlerSpy = jasmine.createSpyObj('HttpErrorHandler', [
      'createHandleError',
    ]);
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    await TestBed.configureTestingModule({
      declarations: [ HandpickedGameFormComponent ],
      providers: [
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: HttpErrorHandler, useValue: httpErrorHandlerSpy },
      ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HandpickedGameFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
