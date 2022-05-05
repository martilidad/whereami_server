import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import {IndexComponent} from "./views/index/index.component";
import {NotFoundComponent} from "./views/not-found/not-found.component";
import {CreateGameComponent} from "./views/create-game/create-game.component";

const routes: Routes = [
  {
    path:"",
    component: IndexComponent,
  },
  {
    path:"createGame",
    component: CreateGameComponent,
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