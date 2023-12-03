import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagoEstudianteComponent } from './pago-estudiante.component';

describe('PagoEstudianteComponent', () => {
  let component: PagoEstudianteComponent;
  let fixture: ComponentFixture<PagoEstudianteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PagoEstudianteComponent]
    });
    fixture = TestBed.createComponent(PagoEstudianteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
