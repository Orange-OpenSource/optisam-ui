import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WasteProductsComponent } from './waste-products.component';
import { TranslateModule } from '@ngx-translate/core';
import { FrenchNumberPipe } from '@shared/common-pipes/french-number.pipe';


describe('WasteProductsComponent', () => {
  let component: WasteProductsComponent;
  let fixture: ComponentFixture<WasteProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WasteProductsComponent, FrenchNumberPipe],
      providers: [{ provide: MAT_DIALOG_DATA, useValue: {} }],
      imports: [TranslateModule.forRoot()]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WasteProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
