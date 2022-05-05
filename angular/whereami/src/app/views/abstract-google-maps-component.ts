import {HttpClient} from "@angular/common/http";
import {Observable, of, share, shareReplay} from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {HandleError, HttpErrorHandler} from "../http-error-handler.service";

export class AbstractGoogleMapsComponent {

  apiLoaded: Observable<boolean>;
  static staticApiLoaded: Observable<boolean>;
  static loadStarted = false;

  constructor(httpClient: HttpClient, private handleError: HandleError) {
    this.apiLoaded = AbstractGoogleMapsComponent.loadGoogleMaps(httpClient, handleError).pipe(share());
  }

  static loadGoogleMaps(httpClient: HttpClient, handleError: HandleError): Observable<boolean> {
    if(!this.loadStarted) {
      this.loadStarted = true;
      this.staticApiLoaded = httpClient.jsonp('https://maps.googleapis.com/maps/api/js?key=AIzaSyBoAJs0qM3UgiFEjvy5Ftcq7bZqijKw0YM&libraries=geometry,drawing', 'callback')
        .pipe(
          map(() => true),
          catchError(handleError('getApi', false)),
          //calling shareReplay makes it irrelevant how often the Observable is subscribed to
        ).pipe(shareReplay());
    }
    return this.staticApiLoaded.pipe(share());
  }
}
