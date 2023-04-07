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
import { GOOGLE } from 'src/app/app.module';

const INACTIVE_MARKER_URL = "/assets/marker.png";

@Component({
  selector: 'hand-picked-manager',
  templateUrl: './hand-picked-manager.component.html',
  styleUrls: ['./hand-picked-manager.component.css']
})
export class HandPickedManagerComponent {

  private _markers: google.maps.Marker[] = []
  private activeMarker!: google.maps.Marker | null
  private dragStartPos: any;
  private streetViewService: google.maps.StreetViewService;
  private pano: google.maps.StreetViewPanorama | undefined;
  private _hidden: boolean = true;
  @Output()
  public statusTextEmitter = new EventEmitter<string>();

  set statusText(value: string) {
    this.statusTextEmitter.emit(value);
  }

  public changed: boolean = false as boolean;

  constructor(@Inject(GoogleMap) private parent: GoogleMap, @Inject(GOOGLE) private google_ns: typeof google) {
    this.streetViewService = new this.google_ns.maps.StreetViewService();
    this.inactiveMarkerIcon = {
      url: INACTIVE_MARKER_URL,
      scaledSize: new this.google_ns.maps.Size(27, 43)
    };
    this.activeMarkerIcon = null;
    /*{
      path: "M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
      fillColor: "blue",
      fillOpacity: 0.6,
      strokeWeight: 0,
      rotation: 0,
      scale: 2,
      anchor: new this.google_ns.maps.Point(15, 30),
    };*/
  }

  @ViewChild("panoDiv", {static: true})
  set panoDiv(value: ElementRef) {
    this.pano = new this.google_ns.maps.StreetViewPanorama(value.nativeElement);
  }


  @Input()
  set hidden(hidden: boolean) {
    this._hidden = hidden;
    if (this.parent.googleMap instanceof this.google_ns.maps.Map) {
      if (hidden) {
        this.google_ns.maps.event.clearListeners(this.parent.googleMap, 'click');
      } else {
        this.parent.googleMap.addListener("click", (event: google.maps.MapMouseEvent | google.maps.IconMouseEvent) => {
          this.changed = true;
          const radius = 50000 / Math.pow(1.6, <number>this.parent.getZoom());
          this.addMarkerFromPanorama(event.latLng!, radius);
        });
      }
    }
  }

  public addMarker(loc: google.maps.LatLng, name: string) {
    if (!this.locationExists(loc)) {
      const marker = new this.google_ns.maps.Marker({
        position: loc,
        map: this.parent.googleMap,
        title: name,
        draggable: true,
      });
      this._markers.push(marker);
      this.activateMarker(marker);
      marker.addListener("click", () => this.activateMarker(marker));
      marker.addListener("dragstart", () => this.onDragStart(marker))
      marker.addListener("dragend", () => this.onDragEnd(marker));
    }
  }

  private locationExists(latLng: google.maps.LatLng) {
    for (let markerId in this._markers) {
        var presentMarker = this._markers[markerId];
        if (this.activeMarker === presentMarker) {
            continue;
        }
        var distance = google.maps.geometry.spherical.computeDistanceBetween(presentMarker.getPosition()!, latLng);
        if (distance < 1) { // two points should not be closer than 1 meter
            var message = "location already exists!";
            console.log(message);
            this.statusText = message;
            return true;
        }
    }
    return false;
}

  public addMarkerFromPanorama(loc: google.maps.LatLng, radius: number) {
    if (!this.locationExists(loc)) {
      this.streetViewService.getPanorama({ location: loc, radius: radius }, this.processPano);
    }
  }

  get hidden() {
    return this._hidden;
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
      if (!this.locationExists(location.latLng)) {
        this.addMarker(location.latLng, location.description);
      }
    } else {
      var message = "no Street view for this area";
      console.log(message);
      this.statusText = message;
    }
  }

  //not static because it needs Maps api import!
  private readonly inactiveMarkerIcon;

  private readonly activeMarkerIcon: string|google.maps.Icon|null|google.maps.Symbol|undefined;


  activateMarker(marker: google.maps.Marker) {
    if (this.activeMarker != null) {
      this.activeMarker.setIcon(this.inactiveMarkerIcon);
    }
    if(marker.setIcon) {
      marker.setIcon(this.activeMarkerIcon);
    }
    this.activeMarker = marker;
    if (this.pano) {
      this.google_ns.maps.event.clearListeners(this.pano, "position_changed");
      this.pano = new this.google_ns.maps.StreetViewPanorama(document.getElementById("pano") as HTMLElement);
      let position;
      if(marker.getPosition && (position = marker.getPosition())) {
        this.pano.setPosition(position);
      }
      this.pano.addListener("position_changed", () => {
        if (this.pano) {
          this.statusText = "";
          if (!this.locationExists(this.pano.getPosition()!)) {
              marker.setPosition(this.pano.getPosition());
              marker.setTitle(this.pano.getLocation()!.description);
          }
        }
      });
    }
  }

  private onDragStart(marker: google.maps.Marker) {
    this.activateMarker(marker);
    this.dragStartPos = marker.getPosition();
  }

  private onDragEnd(marker: google.maps.Marker) {
    const radius = 50000 / Math.pow(1.4, <number>this.parent.getZoom());
    this.streetViewService.getPanorama({
      location: marker.getPosition(),
      radius: radius
    }, this.onPanoRetrieved);
  }

  private onPanoRetrieved = (data: any, status: any) => {
    this.statusText = "";
    if (status === "OK") {
      const location = data.location;
      if (!this.locationExists(location.latLng)) {
        this.activeMarker!.setPosition(location.latLng);
        this.activeMarker!.setTitle(location.description)
        this.updatePano(location.latLng)
      } else {
        this.activeMarker!.setPosition(this.dragStartPos);
      }
    } else {
      this.activeMarker!.setPosition(this.dragStartPos);
      this.statusText = "no street view found for dragged area";
    }
  }

  public focusMarker() {
    if (this.activeMarker != null) {
      this.parent.panTo(this.activeMarker!.getPosition()!);
      this.parent.zoom = 12;
    }
  }

  public deleteMarker() {
    if (this.activeMarker != null) {
      this.activeMarker.setMap(null);
      const index = this._markers.indexOf(this.activeMarker);
      if (index > -1) {
        this._markers.splice(index, 1);
      }
      this.activeMarker = null;
      this.hidden = true;
    }
  }


  get markers(): google.maps.Marker[] {
    return this._markers;
  }
}
