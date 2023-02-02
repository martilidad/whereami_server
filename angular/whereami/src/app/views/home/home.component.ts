import { Component, Inject, OnInit, QueryList, ViewChildren } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { Router, UrlTree } from '@angular/router';
import { Challenge } from '@client/models';
import { range } from 'rxjs';
import { GOOGLE } from 'src/app/app.module';
import { ChallengesService } from 'src/app/service/challenge/challenges.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  mapOptions: google.maps.MapOptions;
  createFormNext: boolean = false;
  
  @ViewChildren('playMap') 
  playMaps: QueryList<GoogleMap> | undefined;
  
  challenges: Challenge[] = [];

  constructor(@Inject(GOOGLE) private google_ns: typeof google,
  private challengesService: ChallengesService,
  private router: Router) {
    this.mapOptions = {
      center: new google_ns.maps.LatLng(0, 0, true),
      zoom: 1,
      mapTypeControl: false,
      streetViewControl: false,
      mapTypeId: google_ns.maps.MapTypeId.ROADMAP,
    };
    this.updateChallenges();
   }

  ngOnInit(): void {
  }

  invite(id: number) {
    const urlTree: UrlTree = this.router.createUrlTree(['/invite'], {
      queryParams: { id: id },
    });
    // would be nice, but sadly does not work without extra permission when not directly triggered by a button press
    // navigator.clipboard.writeText(window.location.origin + urlTree.toString());
    this.router.navigateByUrl(urlTree);
  }

  started(challenge: Challenge): boolean {
    return challenge.locations.some(cl => cl.guessed);
  }

  finished(challenge: Challenge): boolean {
    return challenge.locations.every(cl => cl.guessed);
  }

  updateChallenges() {
    this.challengesService.getChallenges(5).subscribe(values => this.challenges = values);
  }

}
