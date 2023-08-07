import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ProductService } from '@core/services';
import { TranslateModule } from '@ngx-translate/core';
import { FilterEditorPipe } from '../pipes/filter-editor.pipe';
import { FilterProductPipe } from '../pipes/filter-product.pipe';

import { AddNominativeUserComponent } from './add-nominative-user.component';

describe('AddNominativeUserComponent', () => {
  let component: AddNominativeUserComponent;
  let fixture: ComponentFixture<AddNominativeUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        MatAutocompleteModule,
      ],
      declarations: [
        AddNominativeUserComponent,
        FilterEditorPipe,
        FilterProductPipe,
      ],
      providers: [
        { provide: MatDialog, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        FormBuilder,
        ProductService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNominativeUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
