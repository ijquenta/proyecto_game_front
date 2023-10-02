import { TestBed } from '@angular/core/testing';

import { NuevaSolicitudService } from './nueva-solicitud.service';

describe('PlanillaRegularService', () => {
  let service: NuevaSolicitudService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NuevaSolicitudService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
