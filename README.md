# `ng2-json-tree` - XML/JSON Tree for Angular2

## You might find this project helpful if
- You want to render editable tree from XML / JSON. Primarily developed XML in mind.
- You want to have basic skeleton to start with tree.

## Main Features
- **Render JSON/XML** Renders JSON directly on UI. Use XML converter to render XML.
- **Pagination** Supports pagination at each node level to avoid slowness on browserside.
- **Events** Events triggered for tree rendering.
- **Custom Toolbar Actions/Buttons** Supports custom actions/buttons at each node level to have custom actions.
- **Customizable Styles** Supports custom CSS class names to brand according to your needs.

## Rendering XML
Though this library does not support direct editing of XML, But still it works well with XML to JSON converted data. It is tested with https://www.npmjs.com/package/xml-js NPM node module. Convert your XML to JSON using xml-js NPM module and feed that to this library.

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


**TypeScript**
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

**HTML Template**
```html
<ng2-json-tree [json]='json'></ng2-json-tree>
```

### Step 3 - Add/Update default styles at styles.scss

```css
.ng2-json-tree-node {
    background: #67C8FF;
    padding: 5px;
    border-radius: 5px;
    cursor: pointer;
}

.ng2-json-tree-node-expanded {
    border: 1px solid#67C8FF;
    padding: 5px;
    border-radius: 5px;
    cursor: pointer;
    color: #0198E1;
}

.ng2-json-tree-node:hover {
    background: #0198E1;
    color: white
}

.ng2-json-tree-node-expanded:hover {
    background: #0198E1;
    color: white;
}

.ng2-json-tree-toolbar-button {
    display: inline-block;
    border: 1px solid lightgrey;
    border-radius: 10px;
    color: grey;
    margin-left: 5px;
    padding: 1px 5px 1px 5px;
    cursor: pointer;
}

.ng2-json-tree-toolbar-button:hover {
    display: inline-block;
    border: 1px solid lightgrey;
    border-radius: 10px;
    background: #0198E1;
    color: white;
    margin-left: 5px;
    padding: 1px 5px 1px 5px;
}

.ng2-json-tree-toolbar-button-disabled {
    display: inline-block;
    border: 1px solid lightgrey;
    border-radius: 10px;
    color: lightgrey;
    margin-left: 5px;
    padding: 1px 5px 1px 5px;
}

.ng2-json-tree-toolbar-page-text {
    margin-left: 5px
}

.ng2-json-tree-child-area {
    margin-left: 20px;
    margin-bottom: 10px;
    border-left: 1px solid #67C8FF;
}

.ng2-json-tree-input-label {
    width: 150px;
}

.ng2-json-tree-input {
    width: 250px;
}
```

**Output:**
![Simple Tree](https://github.com/arcm-hub/ng2-json-tree/blob/master/img/simple-tree.png?raw=true)


## Pagination

Pass config object additionally with pageSize to show automatic pagination for all the tree nodes automatically.

**Config:**
```json
  config = {
    pageSize: 2
  };
```

**HTML Template:**
```html
<ng2-json-tree [json]='json' [config]='config'></ng2-json-tree>
```

**Output:**
![Paginated Tree](https://github.com/arcm-hub/ng2-json-tree/blob/master/img/paginated-tree.png?raw=true)


## Events

Bind to event output emitter to listen to the events. This library currently emits following events as below.

* **TREE_NODE_CREATED** - Raised when new tree node is created. This event can be used to get hold of d3 element of that node and use that to change styles and customize to add additional toolbar buttons, etc... Toolbar button creation is shown on example below.
* **TEXT_INPUT_CREATED** - Raised when text input is created. Using this we can further customize input boxes using d3.
* **TEXT_INPUT_CHANGED** - Raised when input is changed.

**HTML Template:**
```html
<ng2-json-tree [json]='json' [config]='config' (event)='onEvent($event)'></ng2-json-tree>
```

## Custom Toolbar Buttons

**HTML Template:**
```html
<ng2-json-tree [json]='json' [config]='config' (event)='onEvent($event)'></ng2-json-tree>
```

**Type Script Event Handling:**
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

**Output:**
![Custom Buttons](https://github.com/arcm-hub/ng2-json-tree/blob/master/img/custom-buttons.png?raw=true)


## Reference Links

* Demo Link: https://arcm-hub.github.io/ng2-json-tree-example/index.html
* NPM Library: https://www.npmjs.com/package/ng2-json-tree
* Git Repository for examples: https://github.com/arcm-hub/ng2-json-tree-example
* Git for library source code: https://github.com/arcm-hub/ng2-json-tree
* Feature request / Bugs: https://github.com/arcm-hub/ng2-json-tree/issues/new

You are free to contribute to this open source git repository. 

Thank You !!!