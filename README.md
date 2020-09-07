# `ng2-json-tree` - XML/JSON Tree for Angular2

# You might find this project helpful if
- You want to render editable tree from XML / JSON. Primarily developed XML in mind.
- You want to have basic skeleton to start with tree.

# Main Features
- **Render JSON/XML** Renders JSON directly on UI. Use XML converter to render XML.
- **Pagination** Supports pagination at each node level to avoid slowness on browserside.
- **Events** Events triggered for tree rendering.
- **Custom Toolbar Actions/Buttons** Supports custom actions/buttons at each node level to have custom actions.
- **Customizable Styles** Supports custom CSS class names to brand according to your needs.

# Let's start

## Installation

To include the package into your **Angular** project, simply use the standard npm package installation command:

```
npm install ng2-json-tree --save
```

Please note that the package has a _peer dependency_ on **@angular/core**.

## Usage

Once the module `ng2-json-tree` has been added to a project as described above, it provides the following component exports:

* `ng2-json-tree`: Tree rendering component

The below code snippets assume the use of TypeScript.

### Step 1 - Importing this library with an Angular Module

Import the **Angular module** to your **Angular module**.

```ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Ng2JsonTreeModule } from 'ng2-json-tree';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    Ng2JsonTreeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

### Step 2 - Rendering simple tree with an Angular Component


TypeScript
```ts
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-example1',
  templateUrl: './example1.component.html',
  styleUrls: ['./example1.component.css']
})
export class Example1Component implements OnInit {
  json = {
    "note": {
        "body": {
            "_text": "Don't forget me this weekend!"
        },
        "from": {
            "_text": "Jani"
        },
        "heading": {
            "_text": "Reminder"
        },
        "to": {
            "_text": "Tove"
        }
    }
  }
  constructor() { }

  ngOnInit() {
  }

}
```

HTML Template
```html
<ng2-json-tree [json]='json'></ng2-json-tree>
```
Output:


## Pagination

Config:
```json
  config = {
    pageSize: 2
  };
```

HTML Template:
```html
<ng2-json-tree [json]='json' [config]='config'></ng2-json-tree>
```

Output:

## Events
HTML Template:
```html
<ng2-json-tree [json]='json' [config]='config' (event)='onEvent($event)'></ng2-json-tree>
```

## Custom Toolbar Buttons

HTML Template:
```html
<ng2-json-tree [json]='json' [config]='config' (event)='onEvent($event)'></ng2-json-tree>
```

Type Script Event Handling:
```ts
  onEvent(event: any) {
    var backgroundColor = 'white'
    if(event.type === 'TREE_NODE_CREATED' && event.data.modelKey === 'food') {
      event.data.toolbar.append('span')
      .attr('class', 'ng2-json-tree-toolbar-button')
      .text('highlight')
      .on('click', function(d, i) {
        backgroundColor = backgroundColor === 'white' ? 'lightyellow' : 'white';
        event.data.d3ParentContainer.style('background-color', backgroundColor);
        console.log("CLICKED", event);
      });
    }
  }
```

Output:

## Reference Links

* Demo Link: **TO BE UPDATED**
* NPM Library: https://www.npmjs.com/package/ng2-json-tree
* Git Repository for examples: https://github.com/arcm-hub/ng2-json-tree-example
* Git for library source code: https://github.com/arcm-hub/ng2-json-tree
* Feature request / Bugs: https://github.com/arcm-hub/ng2-json-tree/issues/new

You are free to contribute to this open source git repository. 

Thank You !!!