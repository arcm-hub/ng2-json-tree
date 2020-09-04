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

    private data; // private property _item

    // use getter setter to define the property
    get json(): any { 
      return this.data;
    }
    
    @Input()
    set json(val: any) {
      console.log('previous item = ', this.data);
      console.log('currently selected item=', val);
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
            // rootDiv.append('div').text('root');
            // var rootDElement = rootDiv.append('div');
            this.renderSection(rootDiv, this.data);
        }
    }

    public getPaginatedData(model: any, page: number = -1):any {
        var skipList = ['_attributes'];
        var pageSize = 2;
        var data = Array.isArray(model) ? model : Object.keys(model).filter(key => !skipList.includes(key));
        var data = data.sort();
        var pagination = {
            total: data.length,
            pageSize: pageSize,    
            current_page: page, 
            last_page: Math.ceil(data.length / pageSize),
            from: ((page -1) * pageSize) + 1,
            to: page  * pageSize,
            enabled: page !== -1            
        };
        pagination['data'] = page === -1 ? data : data.slice(pagination.from - 1, pagination.to)
        return pagination;
    }

    public renderSection(d3element: any, model: any, page: number = -1) {
        d3element.selectAll("*").remove();
        if(!model)
          return;
        var _this = this;
        var d3 = this.d3;
        var pagination = this.getPaginatedData(model, page);
        var data = pagination.data;
        console.log("LDKFJ", page, pagination);

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
            })
        } else {
            root.style("margin-left", "10px");

            var header = root.append('div')
                .style("padding", '10px')
                .style("margin-bottom", '-5px')
                .attr("id", key=>"_" + key + "_header");
            header.each(function(d, i) {
                var header: any = d3.select(this);
                if((Object.keys(model[d]).length == 1 && '_text' in model[d]) || Object.keys(model[d]).length <= 0) {
                    header.append('div')
                        .text(key=>key)
                        .style("display", "inline-block")
                        .style("width", "150px") //Parameter
                        .attr("id", key=>"_" + key + "_header");
                    header.append('input')
                        .attr("value", d=>model[d]._text)
                        .style("width", "150px")
                        .on('change', function(d, i, e) {
                            model[d]['_text'] = e[0].value;
                        })
                    _this.raiseEvent('TEXT_INPUT_CREATED', {
                      d3Element: header,
                      d3Parent: root,
                      parentModel: model,
                      model: model[d],
                      modelKey: d,
                      d3
                    })
                } else {
                    let headerTitle = header.append('span')
                                    .text(key=>key)
                                    .attr('class', 'tree-node');

                    let toolbar = header.append('div').style('display', 'inline-block').style('margin-left', '10px');
                    
                    let currentPage = 1;
                    let tButtons = {
                        prev: toolbar.append('div')
                                .attr('class', 'toolbar-button')
                                .style('display', 'none')
                                .text("<")
                                .on("click", function(d, i) {
                                    if(d3.select(this).attr('class') === 'toolbar-button-disabled')
                                        return;
                                    var detail = root.select("#_" + d + "_detail");
                                    _this.renderSection(detail, model[d], --currentPage);
                                    _this.renderPagination(tButtons, _this.getPaginatedData(model[d], currentPage), true);
                                }),
                        text: toolbar.append('span')
                                .attr('class', 'toolbar-page-text')
                                .style('display', 'none')
                                .text("1 of 10"),
                        next: toolbar.append('div')
                                .attr('class', 'toolbar-button')
                                .style('display', 'none')
                                .text(">")
                                .on("click", function(d, i) {
                                    if(d3.select(this).attr('class') === 'toolbar-button-disabled')
                                        return;
                                    var detail = root.select("#_" + d + "_detail");
                                    _this.renderSection(detail, model[d], ++currentPage);
                                    _this.renderPagination(tButtons, _this.getPaginatedData(model[d], currentPage), true);
                                }),
                    }
                    _this.renderPagination(tButtons, _this.getPaginatedData(model[d], currentPage), false);

                    root.append('div')
                        .attr("id", name=>"_" + name + "_detail")
                        .style('margin-left', '20px')
                        .style('margin-bottom', '10px')
                        .style("border-left", "1px solid grey")
                    headerTitle.on('click', function(d, i) {
                        var detail = root.select("#_" + d + "_detail");
                        var expanded = detail.selectAll("*").size() > 0;
                        var pageConfig = _this.getPaginatedData(model[d], currentPage);
                        if(expanded) {
                            _this.renderPagination(tButtons, pageConfig, false);
                            d3.select(this).attr('class', 'tree-node');
                            detail.selectAll("*").remove();
                        } else {
                            _this.renderPagination(tButtons, pageConfig, true);
                            _this.renderSection(detail, model[d], currentPage);
                            d3.select(this).attr('class', 'tree-node-expanded');
                            console.log("Clicked", d, i, detail);
                        }
                    });
                    _this.raiseEvent('TREE_NODE_CREATED', {
                      header, toolbar,
                      d3ParentContainer: root,
                      parentModel: model,
                      model: model[d],
                      modelKey: d,
                      d3
                    })
                }
            })
        }
    }

    private renderPagination(buttons, pagination, visible) {
        console.log("PAGI", pagination);
        if(!visible || pagination.last_page <= 1) {
            buttons.next.style('display', 'none');
            buttons.text.style('display', 'none');
            buttons.prev.style('display', 'none');
            return;
        }

        buttons.text.style('display', 'inline-block')
        buttons.next.style('display', 'inline-block')
                    .attr('class', 'toolbar-button-disabled');
        buttons.prev.style('display', 'inline-block')
                    .attr('class', 'toolbar-button-disabled');

        if(pagination.current_page < pagination.last_page)
            buttons.next.attr('class', 'toolbar-button');

        if(pagination.current_page > 1)
            buttons.prev.attr('class', 'toolbar-button');
        
        buttons.text.text(pagination.current_page + ' of ' + pagination.last_page);
    }

    private raiseEvent(type: string, data: any) {
      this.event.emit({
        type, data
      });
    }
}
