import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotaDocenteComponent } from './nota-docente.component';

describe('NotaDocenteComponent', () => {
  let component: NotaDocenteComponent;
  let fixture: ComponentFixture<NotaDocenteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NotaDocenteComponent]
    });
    fixture = TestBed.createComponent(NotaDocenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
