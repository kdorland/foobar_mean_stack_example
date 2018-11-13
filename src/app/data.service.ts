import { Injectable } from '@angular/core';
import { Subscription, timer } from "rxjs";
import { switchMap } from "rxjs/operators";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../environments/environment";
import { AuthService } from "./auth.service";
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private url_prefix : string = environment.express_url;
  private httpOptions = {};

  data : any[] = [];
  poller : Subscription;

  constructor(
    private http : HttpClient,
    private auth : AuthService,
    private router : Router) {

    if (this.auth.IsLoggedIn()) {
      this.CreateHttpOptions();
      this.StartPoller();
    }
  }

  CreateHttpOptions() {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${this.auth.GetToken()}`
      })
    };
  }

  StartPoller() {
    console.log("Starting poller.");
    this.poller = timer(0, 1000)
      .pipe(switchMap(
        _ => this.http.get<any[]>(this.url_prefix+'/api/my_data', this.httpOptions))
      ).subscribe(data => {
      this.data = data;
    });
  }

  StopPoller() {
    console.log("Stopping poller.");
    this.poller.unsubscribe();
  }

  GetData(theId: string) {
    return this.data.find(d => d._id == theId);
  }

  Authenticate(username, password) {
    this.http.post<any>(`${this.url_prefix}/api/authenticate/`, {
      username: username,
      password: password
    }).subscribe(data => {
      this.auth.SetToken(data.token);
      this.CreateHttpOptions();
      this.StartPoller();
      this.router.navigate(['/example']);
    });
  }
}
