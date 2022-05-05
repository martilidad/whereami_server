import {
  AfterContentInit,
  AfterViewInit,
  Component, ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {GoogleMap} from "@angular/google-maps";

const INCACTIVE_MARKER_URL = "/static/ng/assets/marker.png";

@Component({
  selector: 'hand-picked',
  templateUrl: './hand-picked.component.html',
  styleUrls: ['./hand-picked.component.css']
})
export class HandPickedComponent {

  private markers: any[] = [];
  private activeMarker: any;
  private dragStartPos: any;
  private streetViewService: google.maps.StreetViewService = new google.maps.StreetViewService();
  private pano: google.maps.StreetViewPanorama | undefined;
  @Output()
  public statusTextEmitter = new EventEmitter<string>();

  set statusText(value: string) {
    this.statusTextEmitter.emit(value);
  }

  public changed: boolean = false as boolean;

  constructor(@Inject(GoogleMap) private parent: GoogleMap) {
  }

  @ViewChild("panoDiv", {static: true})
  set panoDiv(value: ElementRef) {
    this.pano = new google.maps.StreetViewPanorama(value.nativeElement);
  }


  @Input()
  set hidden(hidden: boolean) {
    if (this.parent.googleMap instanceof google.maps.Map) {
      if (hidden) {
        google.maps.event.clearListeners(this.parent.googleMap, 'click');
      } else {
        this.parent.googleMap.addListener("click", (event: any) => {
          this.changed = true;
          const radius = 50000 / Math.pow(1.6, <number>this.parent.getZoom());
          this.streetViewService.getPanorama({location: event.latLng, radius: radius}, this.processPano);
        });
      }
    }
  }

  private updatePano(pos: google.maps.LatLng) {
    if (this.pano) {
      this.pano.setPosition(pos);
    }
  }

  private processPano = (data: any, status: any) => {
    this.statusText = "";
    if (status === "OK") {
      const location = data.location;
      const marker = new google.maps.Marker({
        position: location.latLng,
        map: this.parent.googleMap,
        title: location.description,
        draggable: true,
      });
      this.markers.push(marker);
      this.activateMarker(marker);
      marker.addListener("click", this.activateMarker);
      marker.addListener("dragstart", this.onDragStart)
      marker.addListener("dragend", this.onDragEnd);
    } else {
      this.statusText = "no Street view for this area";
    }
  }

  activateMarker(marker: any) {
    if (this.activeMarker != null) {
      this.activeMarker.setIcon({
        url: INCACTIVE_MARKER_URL,
        scaledSize: new google.maps.Size(27, 43)
      });
    }
    marker.setIcon(null);
    this.activeMarker = marker;
    if (this.pano) {
      google.maps.event.clearListeners(this.pano, "position_changed");
      this.pano = new google.maps.StreetViewPanorama(document.getElementById("pano") as HTMLElement);
      this.pano.setPosition(marker.getPosition());
      this.pano.addListener("position_changed", () => {
        if (this.pano) {
          marker.setPosition(this.pano.getPosition());
        }
      });
    }
  }

  private onDragStart: Function = (marker: any) => {
    this.activateMarker(marker);
    this.dragStartPos = marker.getPosition();
  }

  private onDragEnd = (marker: any) => {
    const radius = 50000 / Math.pow(1.4, <number>this.parent.getZoom());
    this.streetViewService.getPanorama({
      location: new google.maps.LatLng(marker.latLng.lat(), marker.latLng.lng()),
      radius: radius
    }, this.onPanoRetrieved);
  }

  private onPanoRetrieved = (data: any, status: any) => {
    this.statusText = "";
    if (status === "OK") {
      const pos = data.location.latLng;
      this.activeMarker.setPosition(pos);
      this.updatePano(pos);
    } else {
      this.activeMarker.setPosition(this.dragStartPos);
      this.statusText = "no street view found for dragged area";
    }
  }

  public focusMarker() {
    if (this.activeMarker != null) {
      this.parent.panTo(this.activeMarker.getPosition());
      this.parent.zoom = 12;
    }
  }

  public deleteMarker() {
    if (this.activeMarker != null) {
      this.activeMarker.setMap(null);
      const index = this.markers.indexOf(this.activeMarker);
      if (index > -1) {
        this.markers.splice(index, 1);
      }
      this.activeMarker = null;
      this.hidden = true;
    }
  }


}
