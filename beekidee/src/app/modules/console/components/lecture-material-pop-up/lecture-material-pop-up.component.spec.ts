import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LectureMaterialPopUpComponent } from './lecture-material-pop-up.component';

describe('LectureMaterialPopUpComponent', () => {
  let component: LectureMaterialPopUpComponent;
  let fixture: ComponentFixture<LectureMaterialPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LectureMaterialPopUpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LectureMaterialPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
