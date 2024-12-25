import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerViewDetailsComponent } from './banner-view-details.component';

describe('BannerViewDetailsComponent', () => {
  let component: BannerViewDetailsComponent;
  let fixture: ComponentFixture<BannerViewDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BannerViewDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BannerViewDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
