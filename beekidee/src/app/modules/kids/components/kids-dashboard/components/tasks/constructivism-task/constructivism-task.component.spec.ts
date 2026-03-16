import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstructivismTaskComponent } from './constructivism-task.component';

describe('ConstructivismTaskComponent', () => {
  let component: ConstructivismTaskComponent;
  let fixture: ComponentFixture<ConstructivismTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConstructivismTaskComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConstructivismTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
