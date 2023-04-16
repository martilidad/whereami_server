import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StartChallengeComponent } from './start-challenge.component';

const routes: Routes = [{ path: '', component: StartChallengeComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StartChallengeRoutingModule { }
