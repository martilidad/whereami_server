import { TestBed } from '@angular/core/testing';
import { ngMocks } from 'ng-mocks';
import { Observable } from 'rxjs';

import { SoundService } from './sound.service';

describe('SoundService', () => {
  let service: SoundService;

  beforeEach(() => {
    service = new SoundService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  //I am to lazy to make this work on firefox; chrome has a cli flag to allow autoplay
  if (navigator.userAgent.includes('HeadlessChrome')) {
    it('should play start', (done) => {
      service.errorHandler = (v) => {
        done.fail(v.message);
      };
      service.start().promise.then(() => done());
    });
    it('should play arrive', (done) => {
      service.errorHandler = (v) => {
        done.fail(v.message);
      };
      service.arrive().promise.then(() => done());
    });
    it('should play complete', (done) => {
      service.errorHandler = (v) => {
        done.fail(v.message);
      };
      service.complete().promise.then(() => done());
    });
    it('should play pin', (done) => {
      service.errorHandler = (v) => {
        done.fail(v.message);
      };
      service.pin().promise.then(() => done());
    });
    it('should play score 100', (done) => {
      service.errorHandler = (v) => {
        done.fail(v.message);
      };
      service.score(10000, 10000)!.promise.then(() => done());
    });
    it('should play score 90', (done) => {
      service.errorHandler = (v) => {
        done.fail(v.message);
      };
      service.score(9111, 10000)!.promise.then(() => done());
    });
    it('should play score 0', (done) => {
      service.errorHandler = (v) => {
        done.fail(v.message);
      };
      service.score(0, 10000)!.promise.then(() => done());
    });
    it('should not play score 50', (done) => {
      service.errorHandler = (v) => {
        done.fail(v.message);
      };
      expect(service.score(5000, 10000)).toBeUndefined();
      done();
    });
    it('should play ten seconds', (done) => {
      service.errorHandler = (v) => {
        done.fail(v.message);
      };
      service.tenSeconds(new Observable()).promise.then(() => done());
    });



  }
});
