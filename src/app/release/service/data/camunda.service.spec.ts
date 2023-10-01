import { TestBed } from '@angular/core/testing';
import { CamundaService } from './camunda.service';

describe('CamundaService', () => {
  let service: CamundaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CamundaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
