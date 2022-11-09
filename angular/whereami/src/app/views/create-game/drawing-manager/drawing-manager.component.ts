import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { NonNullAssert } from '@angular/compiler';
import { GOOGLE } from 'src/app/app.module';

export interface DrawingEvents
  extends google.maps.drawing.OverlayCompleteEvent {
  area: number;
}

@Component({
  selector: 'drawing-manager',
  template: '',
})
export class DrawingManagerComponent implements OnInit, OnDestroy {
  public events: any[] = [];

  public changed: boolean = false as boolean;

  private drawingManager: google.maps.drawing.DrawingManager;
  private _hidden: boolean = false;

  constructor(
    @Inject(GoogleMap) private parent: GoogleMap,
    @Inject(GOOGLE) private google_ns: typeof google
  ) {
    this.drawingManager = new google_ns.maps.drawing.DrawingManager({
      drawingControl: true,
      drawingControlOptions: {
        position: google_ns.maps.ControlPosition.TOP_CENTER,
        drawingModes: [
          google_ns.maps.drawing.OverlayType.CIRCLE,
          google_ns.maps.drawing.OverlayType.POLYLINE,
          google_ns.maps.drawing.OverlayType.RECTANGLE,
        ],
      },
      circleOptions: {
        clickable: false,
        editable: true,
      },
      rectangleOptions: {
        clickable: false,
        editable: true,
      },
      polygonOptions: {
        clickable: false,
        editable: true,
      },
    });
  }

  @Input()
  set hidden(hidden: boolean) {
    this._hidden = hidden;
    if (hidden) {
      this.drawingManager.setMap(null);
      this.events.forEach((e) => e.overlay.setMap(null));
    } else {
      if (this.parent.googleMap instanceof this.google_ns.maps.Map) {
        this.drawingManager.setMap(this.parent.googleMap);
        this.events.forEach((e) =>
          e.overlay.setMap(<google.maps.Map>this.parent.googleMap)
        );
      }
    }
  }

  get hidden() {
    return this._hidden;
  }

  ngOnDestroy(): void {
    this.drawingManager.setMap(null);
  }

  ngOnInit(): void {
    this.drawingManager.setMap(this.parent.googleMap!);
    this.google_ns.maps.event.addListener(
      this.drawingManager,
      'overlaycomplete',
      this.overlayCompleteHandler
    );
  }

  public clear() {
    this.events.forEach((e) => e.overlay.setMap(null));
    this.events = [];
    this.changed = false;
  }

  //TODO fix event typing
  //if you declare it regularly it is not an instance function! -_-
  private overlayCompleteHandler: Function = (
    event: google.maps.drawing.OverlayCompleteEvent
  ) => {
    if (
      event.type === 'circle' ||
      event.type === 'rectangle' ||
      event.type === 'polygon'
    ) {
      // rectangle polygon circle
      let drawEvent = <DrawingEvents>event;
      this.changed = true;
      drawEvent.area = DrawingManagerComponent.calculateEventArea(drawEvent);
      this.events.push(drawEvent);
    }
  };

  private static calculateEventArea(event: DrawingEvents): number {
    switch (event.overlay!.constructor) {
      case google.maps.Circle:
        return (<google.maps.Circle>event.overlay).getRadius() ** 2 * Math.PI;
      case google.maps.Polygon:
        return google.maps.geometry.spherical.computeArea(
          (<google.maps.Polygon>event.overlay).getPath()
        );
      case google.maps.Rectangle:
        let bounds = (<google.maps.Rectangle>event.overlay).getBounds()!;
        let southWest = bounds.getSouthWest();
        let northEast = bounds.getNorthEast();
        let lngDist = DrawingManagerComponent.calcCrow(
          southWest,
          new google.maps.LatLng(southWest.lat(), northEast.lng())
        );
        let latDist = DrawingManagerComponent.calcCrow(
          new google.maps.LatLng(southWest.lat(), northEast.lng()),
          northEast
        );
        return lngDist * latDist;
      default:
        throw new Error('unknown event, aborting map creation');
    }
  }

  public randomPoint = () => {
    if (this.events.length == 0) {
      throw new Error('no events');
    }
    let areaSum = this.events
      .map((event) => event.area)
      .reduce((a, b) => a + b);
    if (areaSum == Number.MAX_VALUE || areaSum == Infinity) {
      throw new Error('areaSum overflow');
    }
    let r = Math.random() * areaSum;
    let sum = 0;
    for (let i = 0; i < this.events.length; i++) {
      sum += this.events[i].area;
      if (r <= sum)
        return DrawingManagerComponent.pointFromEvent(this.events[i]);
    }
    //should not happen
    console.log(
      'Choosing random overlay failed, using last overlay for one point.'
    );
    return DrawingManagerComponent.pointFromEvent(
      this.events[this.events.length - 1]
    );
  };

  private static pointFromEvent(event: DrawingEvents) {
    switch (event.overlay!.constructor) {
      case google.maps.Circle:
      case google.maps.Polygon:
        let overlay = <google.maps.Polygon | google.maps.Circle>event.overlay;
        //this will only trigger client side stuff, let's just find a point
        for (let i = 0; i < 100; i++) {
          let point = DrawingManagerComponent.randomPointFromBounds(
            this.getBounds(overlay)
          );
          if (DrawingManagerComponent.eventContains(event, point)) {
            return point;
          }
        }
        console.log(
          'could not find a point for crazy shape, using random point within bounds.'
        );
        return DrawingManagerComponent.randomPointFromBounds(
          this.getBounds(overlay)
        );
      case google.maps.Rectangle:
        return DrawingManagerComponent.randomPointFromBounds(
          (<google.maps.Rectangle>event.overlay).getBounds()!
        );
      default:
        throw new Error('unknown event, aborting map creation');
    }
  }

  private static getBounds(
    element: google.maps.Circle | google.maps.Polygon
  ): google.maps.LatLngBounds {
    if (element instanceof google.maps.Polygon) {
      let bounds = new google.maps.LatLngBounds();
      element.getPath().forEach((element) => bounds.extend(element));
      return bounds;
    } else {
      return element.getBounds()!;
    }
  }

  private static randomPointFromBounds(
    bounds: google.maps.LatLngBounds
  ): google.maps.LatLng {
    let southWest = bounds.getSouthWest();
    let northEast = bounds.getNorthEast();
    let lngSpan = northEast.lng() - southWest.lng();
    let latSpan = northEast.lat() - southWest.lat();
    return new google.maps.LatLng(
      southWest.lat() + latSpan * Math.random(),
      southWest.lng() + lngSpan * Math.random()
    );
  }

  /**
   * Checks whether a Point is contained in an event.
   * @param event
   * @param latLng
   * @private
   */
  private static eventContains(event: any, latLng: google.maps.LatLng) {
    switch (event.type) {
      case 'polygon':
        return google.maps.geometry.poly.containsLocation(
          latLng,
          event.overlay
        );
      case 'circle':
        return (
          DrawingManagerComponent.calcCrow(latLng, event.overlay.getCenter()) <=
          event.overlay.getRadius()
        );
      case 'rectangle':
        return event.overlay.getBounds().contains(latLng);
      default:
        throw new Error('unkown event, aborting map creation');
    }
  }

  /**
   * Get the distance between two points as the Crow flies.
   * @param p1
   * @param p2
   * @private
   */
  static calcCrow(p1: google.maps.LatLng, p2: google.maps.LatLng): number {
    let R = 6371; // km
    let dLat = DrawingManagerComponent.toRad(p2.lat() - p1.lat());
    let dLon = DrawingManagerComponent.toRad(p2.lng() - p1.lng());
    let rad1 = DrawingManagerComponent.toRad(p1.lat());
    let rad2 = DrawingManagerComponent.toRad(p2.lat());

    let a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(rad1) * Math.cos(rad2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // Converts numeric degrees to radians
  private static toRad(Value: number): number {
    return (Value * Math.PI) / 180;
  }
}
