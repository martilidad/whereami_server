import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MockBuilder, MockInstance, MockRender, ngMocks } from 'ng-mocks';
import { AppModule } from 'src/app/app.module';
import { SettingsService, VOLUME } from 'src/app/service/settings/settings.service';

import { NavbarComponent } from './navbar.component';

describe('NavbarComponent', () => {

  beforeEach(async () => {
    ngMocks.autoSpy('jasmine');
    return MockBuilder(NavbarComponent, AppModule)
    .provide({ provide: SettingsService, useFactory: () => {
      let mock = jasmine.createSpyObj(SettingsService, ['load']);
      mock.load.and.returnValue(0.3)
      return mock;
    }})
  });

  it('should create', () => {
    const component = MockRender(NavbarComponent);
    expect(component.componentInstance.volume).toEqual(0.3);
    expect(component.debugElement.query(By.css('#volume'))).toBeTruthy();
  });
});
