import { Component, Inject, OnInit, QueryList, ViewChildren } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { Router, UrlTree } from '@angular/router';
import { range } from 'rxjs';
import { GOOGLE } from 'src/app/app.module';
import { RuntimeChallenge } from 'src/app/model/game-model/runtime-challenge';
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
  
  challenges: RuntimeChallenge[] = [];

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

  started(challenge: RuntimeChallenge): boolean {
    return challenge.challengelocation_set.some(cl => cl.guessed);
  }

  finished(challenge: RuntimeChallenge): boolean {
    return challenge.challengelocation_set.every(cl => cl.guessed);
  }

  updateChallenges() {
    this.challengesService.getRuntimeChallenges(5).subscribe(values => this.challenges = values);
  }

}
