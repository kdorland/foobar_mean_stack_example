import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes} from "@angular/router";
import { FooComponent } from "./foo/foo.component";
import { BarComponent } from "./bar/bar.component";
import { LoginComponent } from "./login/login.component";

const appRoutes : Routes = [
  { path: "login", component: LoginComponent },
  { path: "example", component : FooComponent},
  { path: "example_with_id/:id", component : BarComponent},
  { path: "**", redirectTo: "example"}
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(appRoutes, { enableTracing: false})
  ],
  declarations: [],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
