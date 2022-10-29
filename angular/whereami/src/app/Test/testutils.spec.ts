import { Component, InjectionToken } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { Observable, scan, Subject } from 'rxjs';
import { GOOGLE } from '../app.module';

const mockData = {
  // some arbitrary data
};

export class WebSocketServiceSpy {
  private messageSpy = new Subject<string>();
  private messageHandler = this.messageSpy.asObservable();

  createObservableSocket(url: string): Observable<string> {
    console.log(`Websocket would connect to ${url}.`);

    return new Observable((observer) => {
      this.messageHandler.subscribe(() => {
        observer.next(JSON.stringify(mockData));
      });
    });
  }

  sendMessage(message: any) {
    this.messageSpy.next(message);
  }
}

export const GOOGLE_TESTING_PROVIDER = {
  provide: GOOGLE,
  useValue: {
    maps: {
      LatLng: function (lat: number, lng: number) {
        return {
          latitude: lat,
          longitude: lng,

          lat: function () {
            return this.latitude;
          },
          lng: function () {
            return this.longitude;
          },
        };
      },
      LatLngBounds: function (ne: number, sw: number) {
        return {
          getSouthWest: function () {
            return sw;
          },
          getNorthEast: function () {
            return ne;
          },
        };
      },
      OverlayView: function () {
        return {};
      },
      InfoWindow: function () {
        return {};
      },
      Marker: function () {
        return {};
      },
      MarkerImage: function () {
        return {};
      },
      Map: function () {
        return { fitBounds: function () {} };
      },
      Point: function () {
        return {};
      },
      Size: function () {
        return {};
      },
      MapTypeId: {
        ROADMAP: 'ROADMAP',
      },
      StreetViewService: function () {
        return {
          getPanorama: function (
            request:
              | google.maps.StreetViewLocationRequest
              | google.maps.StreetViewPanoRequest,
            callback?: (
              a: google.maps.StreetViewPanoramaData | null,
              b: google.maps.StreetViewStatus
            ) => void
          ): any {
            return {
              data: {},
            };
          },
        };
      },
      StreetViewPanorama: function (
        container: HTMLElement,
        opts?: google.maps.StreetViewPanoramaOptions | null
      ) {},
      StreetViewCoverageLayer: function () {},
      ControlPosition: { RIGHT_CENTER: 'RIGHT_CENTER', TOP_CENTER: 'TOP_CENTER' },
      drawing: {
        DrawingManager: function () {
          return { setMap: function () {} };
        },
        OverlayType: {
          CIRCLE: 'CIRCLE',
          POLYLINE: 'POLYLINE',
          RECTANGLE: 'RECTANGLE',
        },
      },
      event: {
        addListener: function() {}
      }
    },
  },
};

@Component({
  selector: 'google-map',
  template: '<ng-content></ng-content>',
})
export class GoogleMapStubComponent {
  fitBounds() {}
  controls = {
    RIGHT_CENTER: [],
    TOP_CENTER: []
  };
}

export const GOOGLE_MAP_STUB = {
  provide: GoogleMap,
  useValue: new GoogleMapStubComponent(),
};


/**
 * Assert that an observable will emit all required objects. 
 * Asserts in order and correct number of emissions. (as long as nothing else calls done)
 * @param observable the observable to test
 * @param expectedResults the expected emitions
 * @param done the jasmine test finalizer callback
 */
export function assertEmitions<T>(observable: Observable<T>, expectedResults: T[], done: DoneFn) {
  observable.pipe(scan<T, T[]>((acc, val) => [...acc, val], []))
  .subscribe(emitions => {
    emitions.forEach((emission, i) => {
      expect(emission).toEqual(expectedResults[i]);
    });
    if(emitions.length == expectedResults.length) {
      done();
    }
    if(emitions.length > expectedResults.length) {
      fail("more emitions than expected");
    }
  })
}
