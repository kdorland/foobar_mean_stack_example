import { Component, OnInit } from '@angular/core';
import { DataService } from "../data.service";

@Component({
  selector: 'app-foo',
  templateUrl: './foo.component.html',
  styleUrls: ['./foo.component.css']
})
export class FooComponent implements OnInit {

  constructor(
    private service : DataService
  ) { }

  ngOnInit() {
  }

  GetData() : any[] {
    return this.service.data;
  }

  GetId(data) : number {
    if (data) return data._id;
    else return -1;
  }

}
