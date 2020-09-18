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
    var backgroundColor = 'white';
    if(event.type === "TREE_NODE_CREATED") {
      event.data.toolbar.append('span')
      .attr('class', 'ng2-json-tree-toolbar-button')
      .text('highlight')
      .on('click', function(d, i) {
        backgroundColor = backgroundColor === 'white' ? 'lightyellow' : 'white';
        // event.data.d3Container.style('background-color', backgroundColor);
        event.data.d3Container.remove();
        console.log("CLICKED", event);
      });

    } else if (event.type === "SECTION_TOOLBAR_CREATED") {
      event.data.toolbar.append('span')
      .attr('class', 'ng2-json-tree-toolbar-button')
      .text('highlight')
      .on('click', function(d, i) {
        backgroundColor = backgroundColor === 'white' ? 'lightyellow' : 'white';
        event.data.d3Container.style('background-color', backgroundColor);
        console.log("CLICKED", event);
      });
      
    }
  }
}
