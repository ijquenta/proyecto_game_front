import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagoEstudianteMatriculaComponent } from './pago-estudiante-matricula.component';

describe('PagoEstudianteComponent', () => {
  let component: PagoEstudianteMatriculaComponent;
  let fixture: ComponentFixture<PagoEstudianteMatriculaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PagoEstudianteMatriculaComponent]
    });
    fixture = TestBed.createComponent(PagoEstudianteMatriculaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
