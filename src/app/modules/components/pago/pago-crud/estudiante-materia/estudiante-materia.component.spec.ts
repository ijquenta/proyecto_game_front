import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstudianteMateriaComponent } from './estudiante-materia.component';

describe('EstudianteMateriaComponent', () => {
  let component: EstudianteMateriaComponent;
  let fixture: ComponentFixture<EstudianteMateriaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EstudianteMateriaComponent]
    });
    fixture = TestBed.createComponent(EstudianteMateriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
