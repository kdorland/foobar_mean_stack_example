import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { DataService } from "../data.service";

@Component({
  selector: 'app-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.css']
})
export class BarComponent implements OnInit {
  private theId : string;

  constructor(
    private route : ActivatedRoute,
    private router : Router,
    private service : DataService) { }

  ngOnInit() {
    this.theId = this.route.snapshot.paramMap.get('id');
  }

  GetId() : string {
    return this.theId;
  }

  GetData() : any {
    return this.service.GetData(this.theId);
  }

}
