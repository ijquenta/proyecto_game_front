import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MateriaEstudianteComponent } from './materia-estudiante.component';

describe('MateriaEstudianteComponent', () => {
  let component: MateriaEstudianteComponent;
  let fixture: ComponentFixture<MateriaEstudianteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MateriaEstudianteComponent]
    });
    fixture = TestBed.createComponent(MateriaEstudianteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
