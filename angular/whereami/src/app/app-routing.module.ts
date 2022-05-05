import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import {IndexComponent} from "./index/index.component";
import {NotFoundComponent} from "./not-found/not-found.component";
import {TestComponent} from "./test/test.component";

const routes: Routes = [
  {
    path:"",
    component: IndexComponent,
  },
  {
    path:"test",
    component: TestComponent,
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
