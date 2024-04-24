import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelVideoComponent } from './panel-video.component';

describe('PanelVideoComponent', () => {
  let component: PanelVideoComponent;
  let fixture: ComponentFixture<PanelVideoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PanelVideoComponent]
    });
    fixture = TestBed.createComponent(PanelVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
