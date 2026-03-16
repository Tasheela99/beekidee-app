import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonsContextComponent } from './lessons-context.component';

describe('LessonsContextComponent', () => {
  let component: LessonsContextComponent;
  let fixture: ComponentFixture<LessonsContextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LessonsContextComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LessonsContextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
