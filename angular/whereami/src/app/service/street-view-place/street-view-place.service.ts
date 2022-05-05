import {Injectable} from '@angular/core';
import {StreetViewPlace} from "./streetViewPlace";
import {readyException} from "jquery";
import {DrawingManagerComponent} from "../../embedabble/drawing-manager/drawing-manager.component";
import {AbstractGoogleMapsComponent} from "../../views/abstract-google-maps-component";
import {HttpErrorHandler} from "../../http-error-handler.service";
import {HttpClient} from "@angular/common/http";

const SEARCH_RADIUS = 10000;

const MAX_IGNORES = 1000;

@Injectable({
  providedIn: 'root'
})
export class StreetViewPlaceService extends AbstractGoogleMapsComponent{
  private webService: google.maps.StreetViewService | undefined;


  constructor(httpClient: HttpClient, httpErrorHandler: HttpErrorHandler) {
    super(httpClient, httpErrorHandler.createHandleError('StreetViewPlaceService'));
    this.apiLoaded.subscribe(value => {
      if(value) {
        this.webService = new google.maps.StreetViewService();
      }
    })
  }

  public async getPlaces(pointGenerator: () => google.maps.LatLng, messageConsumer: (message: string) => {},
                         quantity: number, minDist: number, allowPhotoSpheres: boolean): Promise<StreetViewPlace[]> {
    if(!this.webService) {
      throw Error("Unexpectedly not initialized.");
    }
    let webService = this.webService;
    let ignores = 0;
    let places: StreetViewPlace[] = [];
    while (places.length < quantity && ignores <= MAX_IGNORES) {
      let point = pointGenerator();
      //synchronous request, wait for api return
      let panoData = await new Promise<google.maps.StreetViewPanoramaData | null>((resolve, reject) => {
        webService.getPanorama({
          location: point,
          radius: SEARCH_RADIUS,
          source: allowPhotoSpheres ? google.maps.StreetViewSource.DEFAULT : google.maps.StreetViewSource.OUTDOOR,
          preference: google.maps.StreetViewPreference.BEST
        }, (a: google.maps.StreetViewPanoramaData | null, b) => resolve(a))
      });
      if (panoData && panoData.location && panoData.location.latLng) {
        let latLng = panoData.location.latLng;
        //confirm this is a new place
        let newLocation = true;
        for (const i in places) {
          const dist = DrawingManagerComponent.calcCrow(places[i].toLatLng(), latLng);
          if (dist < minDist) {
            newLocation = false;
            ignores++;
            break;
          }
        }
        if (newLocation) {
          places.push(new StreetViewPlace(latLng.lat(), latLng.lng(), typeof panoData.location.shortDescription === "string" ? panoData.location.shortDescription : "Description Missing"));
        }
      } else {
        ignores++;
      }
      messageConsumer(`Loading Locations ${places.length}/${quantity} Ignored: ${ignores}/${MAX_IGNORES}`);
    }
    return places;
  }
}
