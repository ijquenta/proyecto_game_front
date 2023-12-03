import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotaEstudianteComponent } from './nota-estudiante.component';

describe('NotaEstudianteComponent', () => {
  let component: NotaEstudianteComponent;
  let fixture: ComponentFixture<NotaEstudianteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NotaEstudianteComponent]
    });
    fixture = TestBed.createComponent(NotaEstudianteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
