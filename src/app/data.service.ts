import { Injectable } from '@angular/core';
import { timer } from "rxjs";
import { switchMap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { environment } from "../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private url_prefix : string = environment.express_url;

  data : any[] = [];

  constructor(private http : HttpClient) {
    console.log("Starting poller.");
    timer(0, 1000)
      .pipe(switchMap(
        _ => this.http.get<any[]>(this.url_prefix+'/api/my_data'))
      ).subscribe(data => {
        this.data = data;
    })
  }

  GetData(theId: string) {
    return this.data.find(d => d._id == theId);
  }
}
