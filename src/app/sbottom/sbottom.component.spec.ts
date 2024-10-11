import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SbottomComponent } from './sbottom.component';

describe('SbottomComponent', () => {
  let component: SbottomComponent;
  let fixture: ComponentFixture<SbottomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SbottomComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SbottomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
