import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskContextComponent } from './task-context.component';

describe('TaskContextComponent', () => {
  let component: TaskContextComponent;
  let fixture: ComponentFixture<TaskContextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskContextComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskContextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
