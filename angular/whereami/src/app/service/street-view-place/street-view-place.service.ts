import { Inject, Injectable } from '@angular/core';
import { Location } from '@client/models';
import { GOOGLE } from 'src/app/app.module';
import { DrawingManagerComponent } from "../../views/create-game/drawing-manager/drawing-manager.component";
import { StreetViewPlaceImpl } from "./streetViewPlace";

const SEARCH_RADIUS = 10000;

const MAX_IGNORES = 1000;

@Injectable({
  providedIn: 'root'
})
export class StreetViewPlaceService {

  private webService: google.maps.StreetViewService;

  constructor(@Inject(GOOGLE) private google_ns: typeof google){
    this.webService = new this.google_ns.maps.StreetViewService()
  }


  public async getPlaces(pointGenerator: () => google.maps.LatLng, messageConsumer: (message: string) => {},
                         quantity: number, minDist: number, allowPhotoSpheres: boolean): Promise<Location[]> {
    let ignores = 0;
    let places: StreetViewPlaceImpl[] = [];
    while (places.length < quantity && ignores <= MAX_IGNORES) {
      let point = pointGenerator();
      //synchronous request, wait for api return
      let panoData = await new Promise<google.maps.StreetViewPanoramaData | null>((resolve, reject) => {
        this.webService.getPanorama({
          location: point,
          radius: SEARCH_RADIUS,
          source: allowPhotoSpheres ? this.google_ns.maps.StreetViewSource.DEFAULT : this.google_ns.maps.StreetViewSource.OUTDOOR,
          preference: this.google_ns.maps.StreetViewPreference.BEST
        }, (a: google.maps.StreetViewPanoramaData | null, b) => resolve(a))
      });
      if (panoData && panoData.location && panoData.location.latLng) {
        let latLng = panoData.location.latLng;
        //confirm this is a new place
        let newLocation = true;
        for (const i in places) {
          const dist = DrawingManagerComponent.calcCrow(places[i].toLatLng(this.google_ns), latLng);
          if (dist < minDist) {
            newLocation = false;
            ignores++;
            break;
          }
        }
        if (newLocation) {
          places.push(new StreetViewPlaceImpl(latLng.lat(), latLng.lng(), typeof panoData.location.shortDescription === "string" ? panoData.location.shortDescription : "Description Missing"));
        }
      } else {
        ignores++;
      }
      messageConsumer(`Loading Locations ${places.length}/${quantity} Ignored: ${ignores}/${MAX_IGNORES}`);
    }
    return places.map(latlng => ({"id": null, "pub_date": null, "lat": latlng.Lat, "long": latlng.Long, "name": latlng.Name}));
  }
}
