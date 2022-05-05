import {Component, Inject, OnInit} from '@angular/core';
import {GoogleMap} from "@angular/google-maps";

@Component({
  selector: 'drawing-manager',
  template: ''
})
export class DrawingManagerComponent implements OnInit {

  public events: any[] = [];
  public changed: boolean = false as boolean;

  private drawingManager: any = new google.maps.drawing.DrawingManager({
    drawingControl: true,
    drawingControlOptions: {
      position: google.maps.ControlPosition.TOP_CENTER,
      drawingModes: [google.maps.drawing.OverlayType.CIRCLE, google.maps.drawing.OverlayType.POLYLINE, google.maps.drawing.OverlayType.RECTANGLE]
    },
    circleOptions: {
      clickable: false,
      editable: true
    },
    rectangleOptions: {
      clickable: false,
      editable: true
    },
    polygonOptions: {
      clickable: false,
      editable: true
    }
  })

  constructor(@Inject(GoogleMap) private parent: GoogleMap) { }

  ngOnInit(): void {
    this.drawingManager.setMap(this.parent.googleMap);
    google.maps.event.addListener(this.drawingManager, 'overlaycomplete', this.overlayCompleteHandler)
  }

  //if you declare it regularly it is not an instance function! -_-
  private overlayCompleteHandler: Function = (event: any) => {
    if (event.type === 'circle' || event.type === 'rectangle' || event.type === 'polygon') { // rectangle polygon circle
      this.changed = true;
      this.events.push(event);
    }
  }
}
