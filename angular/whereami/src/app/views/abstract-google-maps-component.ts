import {HttpClient} from "@angular/common/http";
import {Observable, of, share} from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {HandleError, HttpErrorHandler} from "../http-error-handler.service";

export class AbstractGoogleMapsComponent {

  apiLoaded: Observable<boolean>;

  constructor(httpClient: HttpClient, private handleError: HandleError) {
    this.apiLoaded = httpClient.jsonp('https://maps.googleapis.com/maps/api/js?key=TODO&libraries=geometry,drawing', 'callback')
      .pipe(
        map(() => true),
        catchError(this.handleError('getApi', false)),
        //calling share makes it irrelevant how often the Observable is subscribed to
      ).pipe(share());
  }
}
