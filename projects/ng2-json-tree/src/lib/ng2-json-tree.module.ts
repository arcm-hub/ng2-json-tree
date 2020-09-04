import { NgModule } from '@angular/core';
import { Ng2JsonTreeComponent } from './ng2-json-tree.component';
import { D3Service } from 'd3-ng2-service';
import { HttpModule } from '@angular/http';

@NgModule({
  imports: [
    HttpModule
  ],
  providers: [
    D3Service
  ],
  declarations: [Ng2JsonTreeComponent],
  exports: [Ng2JsonTreeComponent]
})
export class Ng2JsonTreeModule { }
