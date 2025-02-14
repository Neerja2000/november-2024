import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmiDetailsComponent } from './emi-details.component';

describe('EmiDetailsComponent', () => {
  let component: EmiDetailsComponent;
  let fixture: ComponentFixture<EmiDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmiDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmiDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
