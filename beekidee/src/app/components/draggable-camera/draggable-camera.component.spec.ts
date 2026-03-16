import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DraggableCameraComponent } from './draggable-camera.component';

describe('DraggableCameraComponent', () => {
  let component: DraggableCameraComponent;
  let fixture: ComponentFixture<DraggableCameraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DraggableCameraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DraggableCameraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
