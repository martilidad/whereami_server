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

const INACTIVE_MARKER_URL = "/static/ng/assets/marker.png";

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
    this.activeMarkerIcon = {
      path: "M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
      fillColor: "blue",
      fillOpacity: 0.6,
      strokeWeight: 0,
      rotation: 0,
      scale: 2,
      anchor: new this.google_ns.maps.Point(15, 30),
    };
  }

  @ViewChild("panoDiv", {static: true})
  set panoDiv(value: ElementRef) {
    this.pano = new this.google_ns.maps.StreetViewPanorama(value.nativeElement);
  }


  @Input()
  set hidden(hidden: boolean) {
    if (this.parent.googleMap instanceof google.maps.Map) {
      if (hidden) {
        this.google_ns.maps.event.clearListeners(this.parent.googleMap, 'click');
      } else {
        this.parent.googleMap.addListener("click", (event: google.maps.MapMouseEvent | google.maps.IconMouseEvent) => {
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
      const marker = new this.google_ns.maps.Marker({
        position: location.latLng,
        map: this.parent.googleMap,
        title: location.description,
        draggable: true,
      });
      this._markers.push(marker);
      this.activateMarker(marker);
      marker.addListener("click", () => this.activateMarker(marker));
      marker.addListener("dragstart", () => this.onDragStart(marker))
      marker.addListener("dragend", () => this.onDragEnd(marker));
    } else {
      this.statusText = "no Street view for this area";
    }
  }

  //not static because it needs Maps api import!
  private readonly inactiveMarkerIcon;

  private readonly activeMarkerIcon;


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
          marker.setPosition(this.pano.getPosition());
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
      const pos = data.location.latLng;
      this.activeMarker!.setPosition(pos);
      this.updatePano(pos);
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
