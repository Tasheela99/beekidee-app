import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KidsDashboardComponent } from './kids-dashboard.component';

describe('KidsDashboardComponent', () => {
  let component: KidsDashboardComponent;
  let fixture: ComponentFixture<KidsDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KidsDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KidsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
