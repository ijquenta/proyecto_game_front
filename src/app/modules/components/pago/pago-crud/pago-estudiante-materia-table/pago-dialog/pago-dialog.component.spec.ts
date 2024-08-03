import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagoDialogComponent } from './pago-dialog.component';

describe('PagoDialogComponent', () => {
  let component: PagoDialogComponent;
  let fixture: ComponentFixture<PagoDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PagoDialogComponent]
    });
    fixture = TestBed.createComponent(PagoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
