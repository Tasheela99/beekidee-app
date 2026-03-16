import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LectureMaterialListComponent } from './lecture-material-list.component';

describe('LectureMaterialListComponent', () => {
  let component: LectureMaterialListComponent;
  let fixture: ComponentFixture<LectureMaterialListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LectureMaterialListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LectureMaterialListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
