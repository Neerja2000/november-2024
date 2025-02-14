import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCreditStatusComponent } from './view-credit-status.component';

describe('ViewCreditStatusComponent', () => {
  let component: ViewCreditStatusComponent;
  let fixture: ComponentFixture<ViewCreditStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewCreditStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewCreditStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
