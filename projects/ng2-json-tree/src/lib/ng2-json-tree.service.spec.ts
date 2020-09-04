import { TestBed, inject } from '@angular/core/testing';

import { Ng2JsonTreeService } from './ng2-json-tree.service';

describe('Ng2TreeViewService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Ng2JsonTreeService]
    });
  });

  it('should be created', inject([Ng2JsonTreeService], (service: Ng2JsonTreeService) => {
    expect(service).toBeTruthy();
  }));
});
