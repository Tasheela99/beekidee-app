import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KidsContextComponent } from './kids-context.component';

describe('KidsContextComponent', () => {
  let component: KidsContextComponent;
  let fixture: ComponentFixture<KidsContextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KidsContextComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KidsContextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
