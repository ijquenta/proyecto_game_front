import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CursoHorarioComponent } from './curso-horario.component';

describe('EstudianteMateriaComponent', () => {
  let component: CursoHorarioComponent;
  let fixture: ComponentFixture<CursoHorarioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CursoHorarioComponent]
    });
    fixture = TestBed.createComponent(CursoHorarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
