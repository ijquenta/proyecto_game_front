import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MateriaPensumComponent } from './materia-pensum.component';

describe('MateriaEstudianteComponent', () => {
  let component: MateriaPensumComponent;
  let fixture: ComponentFixture<MateriaPensumComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MateriaPensumComponent]
    });
    fixture = TestBed.createComponent(MateriaPensumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
