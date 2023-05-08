import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StartChallengeComponent } from './start-challenge.component';
import { RoundEndComponent } from './round-end/round-end.component';

const routes: Routes = [{ 
  path: '', component: StartChallengeComponent }, {
    path: 'end', component: RoundEndComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StartChallengeRoutingModule { }
