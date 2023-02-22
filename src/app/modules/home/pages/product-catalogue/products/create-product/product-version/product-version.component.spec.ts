import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlContainer } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

import { ProductVersionComponent } from './product-version.component';

describe('ProductVersionComponent', () => {
  let component: ProductVersionComponent;
  let fixture: ComponentFixture<ProductVersionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductVersionComponent],
      imports: [MatDialogModule, TranslateModule.forRoot()],
      providers: [ControlContainer],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductVersionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
