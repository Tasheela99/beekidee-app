import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttentionLostPopupComponent } from './attention-lost-popup.component';

describe('AttentionLostPopupComponent', () => {
  let component: AttentionLostPopupComponent;
  let fixture: ComponentFixture<AttentionLostPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttentionLostPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttentionLostPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
