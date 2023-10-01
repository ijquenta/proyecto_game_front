import { TestBed } from '@angular/core/testing';

import { CamundaAuxService } from './camunda-aux.service';

describe('CamundaAuxService', () => {
  let service: CamundaAuxService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CamundaAuxService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
