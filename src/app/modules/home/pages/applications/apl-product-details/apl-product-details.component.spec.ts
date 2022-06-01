import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AplProductDetailsComponent } from './apl-product-details.component';

describe('AplProductDetailsComponent', () => {
  let component: AplProductDetailsComponent;
  let fixture: ComponentFixture<AplProductDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AplProductDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AplProductDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
