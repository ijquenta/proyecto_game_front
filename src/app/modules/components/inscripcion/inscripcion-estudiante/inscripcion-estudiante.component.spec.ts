import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InscripcionEstudianteComponent } from './inscripcion-estudiante.component';

describe('InscripcionEstudianteComponent', () => {
  let component: InscripcionEstudianteComponent;
  let fixture: ComponentFixture<InscripcionEstudianteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InscripcionEstudianteComponent]
    });
    fixture = TestBed.createComponent(InscripcionEstudianteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
