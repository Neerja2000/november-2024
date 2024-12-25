import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateBannerFormComponent } from './update-banner-form.component';

describe('UpdateBannerFormComponent', () => {
  let component: UpdateBannerFormComponent;
  let fixture: ComponentFixture<UpdateBannerFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateBannerFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateBannerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
