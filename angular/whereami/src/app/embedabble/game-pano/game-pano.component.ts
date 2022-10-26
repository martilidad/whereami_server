import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import { GOOGLE } from 'src/app/app.module';

@Component({
  selector: 'game-pano',
  templateUrl: './game-pano.component.html',
  styleUrls: ['./game-pano.component.css']
})
export class GamePanoComponent {
  private pano: google.maps.StreetViewPanorama | undefined;
  private startLocation: google.maps.LatLng | undefined

  constructor(@Inject(GOOGLE) private google_ns: typeof google) {}




  @ViewChild("panoDiv")
  set panoDiv(panoDiv: ElementRef) {
    this.pano = new this.google_ns.maps.StreetViewPanorama(panoDiv.nativeElement, {
      addressControl: false,
      linksControl: false,
      showRoadLabels: false,
      visible: true,
      fullscreenControl: false
    })
  }

  reset(): void {
    if (this.startLocation) {
      this.pano!.setPosition(this.startLocation)
    }
  }

  setLocation(location: google.maps.LatLng) {
    this.startLocation = location
    this.pano!.setPosition(location)
  }



}
