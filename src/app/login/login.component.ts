import { Component, OnInit } from '@angular/core';
import { AuthService } from "../auth.service";
import { DataService } from "../data.service";
import { Router } from "@angular/router";
import { NgForm } from "@angular/forms";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private authService : AuthService,
    private dataService : DataService,
    private router : Router
  ) { }

  ngOnInit() {
  }

  onSubmit(form: NgForm) {
    this.dataService.Authenticate(form.value.username, form.value.password);
  }

}
