import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  json = {};

  public constructor(public http: Http) {
    this.http.get("./assets/data.json").subscribe(resp => {
      this.json = resp.json();
    });
  }

  public onTreeViewEvent(event) {
    console.log("TREE_EVENT", event);
  }
}
