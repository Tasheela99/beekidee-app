import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimationDialogComponent } from './animation-dialog.component';

describe('AnimationDialogComponent', () => {
  let component: AnimationDialogComponent;
  let fixture: ComponentFixture<AnimationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnimationDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnimationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
