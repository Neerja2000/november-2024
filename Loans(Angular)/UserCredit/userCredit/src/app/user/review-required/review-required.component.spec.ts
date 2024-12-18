import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewRequiredComponent } from './review-required.component';

describe('ReviewRequiredComponent', () => {
  let component: ReviewRequiredComponent;
  let fixture: ComponentFixture<ReviewRequiredComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewRequiredComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewRequiredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
