import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsoleContextComponent } from './console-context.component';

describe('ConsoleContextComponent', () => {
  let component: ConsoleContextComponent;
  let fixture: ComponentFixture<ConsoleContextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsoleContextComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsoleContextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
