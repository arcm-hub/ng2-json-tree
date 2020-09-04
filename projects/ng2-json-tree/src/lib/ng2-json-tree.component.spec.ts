import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Ng2JsonTreeComponent } from './ng2-json-tree.component';

describe('Ng2TreeViewComponent', () => {
  let component: Ng2JsonTreeComponent;
  let fixture: ComponentFixture<Ng2JsonTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Ng2JsonTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Ng2JsonTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
