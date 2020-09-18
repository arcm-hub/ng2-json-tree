import { Component, ElementRef, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { D3Service, D3, Selection } from 'd3-ng2-service';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';

@Component({
  selector: 'ng2-json-tree',
  template: ''
})
export class Ng2JsonTreeComponent {
  title = 'app';

    private d3: D3;
    private parentNativeElement: any;
    // private obj: any;
    @Output() event = new EventEmitter<any>();

    private _config = {};

    get config(): any {
        return this._config;
    }

    @Input()
    set config(val: any) {
        this._config = val;
        this.renderTree();
    }

    private data; // private property _item

    // use getter setter to define the property
    get json(): any { 
      return this.data;
    }
    
    @Input()
    set json(val: any) {
      this.data = val;
      this.renderTree();
    }
 
    constructor(element: ElementRef, d3Service: D3Service, private http: Http) {
        this.d3 = d3Service.getD3();
        this.parentNativeElement = element.nativeElement;
    }

    ngOnInit() {
        // this.getJSON().subscribe(data => {
        //     this.obj=data
        //     this.renderTree();
        // }, error => console.log(error));
    }

    public getJSON(): Observable<any> {
        return this.http.get("./assets/data.json").pipe(map(data => data.json()));
    }

    public renderTree() {
        let d3 = this.d3;
        let dpElement: Selection<any, any, any, any>;
    
        if (this.parentNativeElement !== null) {
    
            dpElement = d3.select(this.parentNativeElement);
    
            var rootDiv = dpElement.append('div')
            this.renderSection(rootDiv, this.data);
        }
    }

    public getPaginatedData(model: any, page: number = -1):any {
        var skipList = this.config.skipList ? this.config.skipList : ['_attributes'];
        var pageSize = this.config.pageSize ? this.config.pageSize : 0;
        var data = Array.isArray(model) ? model : Object.keys(model).filter(key => !skipList.includes(key));
        var data = data.sort();
        var pagination = {
            total: data.length,
            pageSize: pageSize,    
            current_page: page, 
            last_page: pageSize === 0 ? 1 : Math.ceil(data.length / pageSize),
            from: ((page -1) * pageSize) + 1,
            to: pageSize === 0 ? data.length : page * pageSize,
            enabled: page !== -1 || pageSize === 0          
        };
        pagination['data'] = (page === -1 || pageSize === 0) ? data : data.slice(pagination.from - 1, pagination.to)
        return pagination;
    }

    public renderSection(d3element: any, model: any, page: number = -1, level: number = 1) {
        d3element.selectAll("*").remove();
        if(!model)
          return;
        var _this = this;
        var d3 = this.d3;
        var pagination = this.getPaginatedData(model, page);
        var data = pagination.data;

        var rootElement = Array.isArray(model) ? d3element.append('ol').attr('start', pagination.from).style('margin', '0px') : d3element;
        var subElement = Array.isArray(model) ? 'li' : 'div';

        var root = rootElement.selectAll(subElement)
            .data(data)
            .enter()
            .append(subElement)
            .attr("child-node", 'true')
            .attr("id", key=>"_" + key);
            
        if(Array.isArray(model)) {
            root.each(function(d, i) {
                const d3SubRoot = d3.select(this);
                _this.renderSection(d3SubRoot, d);
                let sectionToolbar = d3SubRoot.insert("span",":first-child").style('margin-left', '10px');
                _this.raiseEvent('SECTION_TOOLBAR_CREATED', {
                    d3ParentContainer: rootElement,
                    d3Container: d3SubRoot,
                    parentModel: model,
                    modelKey: d,
                    index: i,
                    toolbar: sectionToolbar,
                    model: model,
                    level: level,
                    d3
                });
            })
        } else {
            root.style("margin-left", "10px");

            var header = root.append('div')
                .style("padding", '10px')
                .style("margin-bottom", '-5px')
                .attr("id", "_header");
            header.each(function(d, i) {
                var header: any = d3.select(this);
                if((Object.keys(model[d]).length == 1 && '_text' in model[d]) || Object.keys(model[d]).length <= 0) {
                    header.append('div')
                        .text(key=>key)
                        .style("display", "inline-block")
                        // .style("width", "150px") //Parameter
                        .attr('class', 'ng2-json-tree-input-label')
                        .attr("id", key=>"_" + key + "_header");
                    
                    var textInput = header.append('input')
                        .attr("value", d=>model[d]._text)
                        // .style("width", "150px")
                        .attr('class', 'ng2-json-tree-input')
                        .on('change', function(d, i, e) {
                            _this.raiseEvent('TEXT_INPUT_CHANGED', {
                                d3Element: header,
                                d3Parent: root,
                                parentModel: model,
                                textInput: textInput,
                                model: model[d],
                                modelKey: d,
                                level: level,
                                oldValue: model[d]['_text'],
                                newValue: e[0].value,
                                d3
                              })
                            model[d]['_text'] = e[0].value;
                        })
                    
                    let toolbar = header.append('div').style('display', 'inline-block').style('margin-left', '10px');

                    _this.raiseEvent('TEXT_INPUT_CREATED', {
                        d3Container: header,
                        d3ParentContainer: root,
                        parentModel: model,
                        textInput: textInput,
                        model: model[d],
                        modelKey: d,
                        level: level,
                        toolbar: toolbar,
                        d3
                    })
                } else {
                    let headerTitle = header.append('span')
                                    .text(key=>key)
                                    .attr('class', 'ng2-json-tree-node');

                    let toolbar = header.append('div').attr("id", "_toolbar").style('display', 'inline-block').style('margin-left', '10px');
                    
                    let currentPage = 1;
                    let tButtons = {
                        prev: toolbar.append('div')
                                .attr('class', 'ng2-json-tree-toolbar-button')
                                .style('display', 'none')
                                .text("<")
                                .on("click", function(d, i) {
                                    if(d3.select(this).attr('class') === 'ng2-json-tree-toolbar-button-disabled')
                                        return;
                                    var detail = root.select("#_" + d + "_detail");
                                    _this.renderSection(detail, model[d], --currentPage);
                                    _this.renderPagination(tButtons, _this.getPaginatedData(model[d], currentPage), true);
                                }),
                        text: toolbar.append('span')
                                .attr('class', 'ng2-json-tree-toolbar-page-text')
                                .style('display', 'none'),
                        next: toolbar.append('div')
                                .attr('class', 'ng2-json-tree-toolbar-button')
                                .style('display', 'none')
                                .text(">")
                                .on("click", function(d, i) {
                                    if(d3.select(this).attr('class') === 'ng2-json-tree-toolbar-button-disabled')
                                        return;
                                    var detail = root.select("#_" + d + "_detail");
                                    _this.renderSection(detail, model[d], ++currentPage);
                                    _this.renderPagination(tButtons, _this.getPaginatedData(model[d], currentPage), true);
                                }),
                    }
                    _this.renderPagination(tButtons, _this.getPaginatedData(model[d], currentPage), false);

                    root.append('div')
                        .attr("id", name=>"_" + name + "_detail")
                        .attr('class', 'ng2-json-tree-child-area')
                                        
                    headerTitle.on('click', function(d, i) {
                        var detail = root.select("#_" + d + "_detail");
                        var expanded = detail.selectAll("*").size() > 0;
                        var pageConfig = _this.getPaginatedData(model[d], currentPage);
                        if(expanded) {
                            _this.renderPagination(tButtons, pageConfig, false);
                            d3.select(this).attr('class', 'ng2-json-tree-node');
                            detail.selectAll("*").remove();
                        } else {
                            _this.renderPagination(tButtons, pageConfig, true);
                            _this.renderSection(detail, model[d], currentPage, level++);
                            d3.select(this).attr('class', 'ng2-json-tree-node-expanded');
                        }
                    });
                    _this.raiseEvent('TREE_NODE_CREATED', {
                        header: header, 
                        toolbar: header.select("#_toolbar"),
                        d3ParentContainer: root,
                        d3Container: d3.select(this),
                        parentModel: model,
                        model: d,
                        modelKey: d,
                        level: level,
                        d3
                    })
                }
            })
        }
    }

    private renderPagination(buttons, pagination, visible) {
        if(!visible || pagination.last_page <= 1) {
            buttons.next.style('display', 'none');
            buttons.text.style('display', 'none');
            buttons.prev.style('display', 'none');
            return;
        }

        buttons.text.style('display', 'inline-block')
        buttons.next.style('display', 'inline-block')
                    .attr('class', 'ng2-json-tree-toolbar-button-disabled');
        buttons.prev.style('display', 'inline-block')
                    .attr('class', 'ng2-json-tree-toolbar-button-disabled');

        if(pagination.current_page < pagination.last_page)
            buttons.next.attr('class', 'ng2-json-tree-toolbar-button');

        if(pagination.current_page > 1)
            buttons.prev.attr('class', 'ng2-json-tree-toolbar-button');
        
        buttons.text.text(pagination.current_page + ' of ' + pagination.last_page);
    }

    private raiseEvent(type: string, data: any) {
      this.event.emit({
        type, data
      });
    }
}
