import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttentionReallocationComponent } from './attention-reallocation.component';

describe('AttentionReallocationComponent', () => {
  let component: AttentionReallocationComponent;
  let fixture: ComponentFixture<AttentionReallocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttentionReallocationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttentionReallocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
