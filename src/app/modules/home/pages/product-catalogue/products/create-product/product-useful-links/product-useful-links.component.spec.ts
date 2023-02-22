import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlContainer } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

import { ProductUsefulLinksComponent } from './product-useful-links.component';

describe('ProductUsefulLinksComponent', () => {
  let component: ProductUsefulLinksComponent;
  let fixture: ComponentFixture<ProductUsefulLinksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductUsefulLinksComponent],
      imports: [MatDialogModule, TranslateModule.forRoot()],
      providers: [ControlContainer],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductUsefulLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
