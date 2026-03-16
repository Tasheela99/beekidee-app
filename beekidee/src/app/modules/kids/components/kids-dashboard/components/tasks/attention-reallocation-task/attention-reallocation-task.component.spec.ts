import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttentionReallocationTaskComponent } from './attention-reallocation-task.component';

describe('AttentionReallocationTaskComponent', () => {
  let component: AttentionReallocationTaskComponent;
  let fixture: ComponentFixture<AttentionReallocationTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttentionReallocationTaskComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttentionReallocationTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
