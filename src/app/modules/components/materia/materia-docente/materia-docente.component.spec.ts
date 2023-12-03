import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MateriaDocenteComponent } from './materia-docente.component';

describe('MateriaDocenteComponent', () => {
  let component: MateriaDocenteComponent;
  let fixture: ComponentFixture<MateriaDocenteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MateriaDocenteComponent]
    });
    fixture = TestBed.createComponent(MateriaDocenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
