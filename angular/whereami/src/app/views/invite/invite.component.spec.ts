import { HttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Params } from '@angular/router';
import { of } from 'rxjs';
import { HttpErrorHandler } from 'src/app/http-error-handler.service';
import { GOOGLE_TESTING_PROVIDER } from 'src/app/Test/web-socket-service-spy.spec';

import { InviteComponent } from './invite.component';

describe('InviteComponent', () => {
  let component: InviteComponent;
  let fixture: ComponentFixture<InviteComponent>;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let httpErrorHandlerSpy: jasmine.SpyObj<HttpErrorHandler>;

  beforeEach(async () => {
    let id = 0;
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    httpErrorHandlerSpy = jasmine.createSpyObj('HttpErrorHandler', [
      'createHandleError',
    ]);
    let activatedRouteStub: Partial<ActivatedRoute> = {
      queryParams: of<Params>({id: id})
    }
    await TestBed.configureTestingModule({
      declarations: [InviteComponent],
      providers: [
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: HttpErrorHandler, useValue: httpErrorHandlerSpy },
        {provide: ActivatedRoute, useValue: activatedRouteStub},
        GOOGLE_TESTING_PROVIDER
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(InviteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
