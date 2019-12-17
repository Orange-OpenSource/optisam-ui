import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductrightsComponent } from './productrights.component';

describe('ProductrightsComponent', () => {
  let component: ProductrightsComponent;
  let fixture: ComponentFixture<ProductrightsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductrightsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductrightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
