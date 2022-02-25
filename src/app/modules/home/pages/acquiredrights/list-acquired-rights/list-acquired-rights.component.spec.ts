import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ProductService } from 'src/app/core/services/product.service';
import { CustomMaterialModule } from 'src/app/material.module';

import { ListAcquiredRightsComponent } from './list-acquired-rights.component';

describe('ListAcquiredRightsComponent', () => {
  let component: ListAcquiredRightsComponent;
  let fixture: ComponentFixture<ListAcquiredRightsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListAcquiredRightsComponent ],
      imports: [
        CustomMaterialModule,
        RouterTestingModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot()
      ],
      providers: [
        ProductService,
        { provide: MatDialogRef, useValue: {} }

      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAcquiredRightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
