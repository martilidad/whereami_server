import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'game-pano',
  templateUrl: './game-pano.component.html',
  styleUrls: ['./game-pano.component.css']
})
export class GamePanoComponent {
  private pano: google.maps.StreetViewPanorama | undefined;
  private startLocation: google.maps.LatLng | undefined




  @ViewChild("panoDiv")
  set panoDiv(panoDiv: ElementRef) {
    this.pano = new google.maps.StreetViewPanorama(panoDiv.nativeElement, {
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
