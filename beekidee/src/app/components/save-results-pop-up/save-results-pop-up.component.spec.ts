import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveResultsPopUpComponent } from './save-results-pop-up.component';

describe('SaveResultsPopUpComponent', () => {
  let component: SaveResultsPopUpComponent;
  let fixture: ComponentFixture<SaveResultsPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaveResultsPopUpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaveResultsPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
