import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import {IndexComponent} from "./index/index.component";
import {NotFoundComponent} from "./not-found/not-found.component";

const routes: Routes = [
  {
    path:"",
    component: IndexComponent,
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
