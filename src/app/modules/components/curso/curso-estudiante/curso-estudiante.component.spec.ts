import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CursoEstudianteComponent } from './curso-estudiante.component';

describe('CursoEstudianteComponent', () => {
  let component: CursoEstudianteComponent;
  let fixture: ComponentFixture<CursoEstudianteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CursoEstudianteComponent]
    });
    fixture = TestBed.createComponent(CursoEstudianteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
