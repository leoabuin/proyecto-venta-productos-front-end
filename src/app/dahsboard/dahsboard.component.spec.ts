import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DahsboardComponent } from './dahsboard.component';

describe('DahsboardComponent', () => {
  let component: DahsboardComponent;
  let fixture: ComponentFixture<DahsboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DahsboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DahsboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
