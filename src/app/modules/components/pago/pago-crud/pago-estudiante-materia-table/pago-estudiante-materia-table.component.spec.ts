import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagoEstudianteMateriaTableComponent } from './pago-estudiante-materia-table.component';

describe('PagoEstudianteMateriaTableComponent', () => {
  let component: PagoEstudianteMateriaTableComponent;
  let fixture: ComponentFixture<PagoEstudianteMateriaTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PagoEstudianteMateriaTableComponent]
    });
    fixture = TestBed.createComponent(PagoEstudianteMateriaTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
