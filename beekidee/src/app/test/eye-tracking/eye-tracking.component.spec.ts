import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EyeTrackingComponent } from './eye-tracking.component';

describe('EyeTrackingComponent', () => {
  let component: EyeTrackingComponent;
  let fixture: ComponentFixture<EyeTrackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EyeTrackingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EyeTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
