import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorarioSchedulerComponent } from './horario-scheduler.component';

describe('HorarioSchedulerComponent', () => {
  let component: HorarioSchedulerComponent;
  let fixture: ComponentFixture<HorarioSchedulerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HorarioSchedulerComponent]
    });
    fixture = TestBed.createComponent(HorarioSchedulerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
