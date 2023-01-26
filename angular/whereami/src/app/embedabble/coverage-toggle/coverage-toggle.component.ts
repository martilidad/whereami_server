import {
  Component,
  ElementRef,
  HostListener,
  Inject,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { GOOGLE } from 'src/app/app.module';
import ClickEvent = JQuery.ClickEvent;

@Component({
  selector: 'coverage-toggle',
  templateUrl: './coverage-toggle.component.html',
  styleUrls: ['./coverage-toggle.component.css'],
})
export class CoverageToggleComponent implements OnInit {
  private coverageLayer: google.maps.StreetViewCoverageLayer;

  /**
   * Needs googleMap as parent
   */
  constructor(
    @Inject(GoogleMap) private parent: GoogleMap,
    private ref: ElementRef,
    @Inject(GOOGLE) private google_ns: typeof google
  ) {
    this.coverageLayer = new google_ns.maps.StreetViewCoverageLayer();
    this.position = google_ns.maps.ControlPosition.RIGHT_CENTER;
  }

  @Input()
  private position;

  ngOnInit(): void {
    this.parent.controls[this.position].push(this.ref.nativeElement);
  }

  @HostListener('click', ['$event'])
  onClick(event: ClickEvent): void {
    let googleMap = this.parent.googleMap;
    if (googleMap != undefined) {
      this.coverageLayer.setMap(
        this.coverageLayer.getMap() == null ? googleMap : null
      );
    }
  }
}
