import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import {IndexComponent} from "./views/index/index.component";
import {NotFoundComponent} from "./views/not-found/not-found.component";
import {CreateGameComponent} from "./views/create-game/create-game.component";
import {StartChallengeComponent} from "./views/start-challenge/start-challenge.component";
import {ChallengeOverviewComponent} from "./views/challenge-overview/challenge-overview.component";
import { InviteComponent } from './views/invite/invite.component';
import { HomeComponent } from './views/home/home.component';

const routes: Routes = [
  {
    path:"",
    component: IndexComponent,
  },
  {
    path:"home",
    component: HomeComponent,
  },
  {
    path:"invite",
    component: InviteComponent
  },
  {
    path:"createGame",
    component: CreateGameComponent,
  },
  {
    path:"startChallenge",
    component: StartChallengeComponent,
  },
  {
    path:"challengeOverview",
    component: ChallengeOverviewComponent,
  },
  {
    path:"**",
    component: NotFoundComponent,
  }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
