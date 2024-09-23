import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddbrandsComponent } from './addbrands.component';

describe('AddbrandsComponent', () => {
  let component: AddbrandsComponent;
  let fixture: ComponentFixture<AddbrandsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddbrandsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddbrandsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
