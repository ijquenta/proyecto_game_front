import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialEstudianteComponent } from './material-estudiante.component';

describe('MateriaEstudianteComponent', () => {
  let component: MaterialEstudianteComponent;
  let fixture: ComponentFixture<MaterialEstudianteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MaterialEstudianteComponent]
    });
    fixture = TestBed.createComponent(MaterialEstudianteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
