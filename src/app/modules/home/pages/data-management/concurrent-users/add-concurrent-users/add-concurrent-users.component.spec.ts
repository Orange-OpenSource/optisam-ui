import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialogModule } from '@angular/material/dialog';
import { ProductService } from '@core/services';
import { TranslateModule } from '@ngx-translate/core';
import { FilterEditorPipe } from '../../nominative-users/pipes/filter-editor.pipe';
import { FilterProductPipe } from '../../nominative-users/pipes/filter-product.pipe';

import { AddConcurrentUsersComponent } from './add-concurrent-users.component';

describe('AddConcurrentUsersComponent', () => {
  let component: AddConcurrentUsersComponent;
  let fixture: ComponentFixture<AddConcurrentUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AddConcurrentUsersComponent,
        FilterEditorPipe,
        FilterProductPipe,
      ],
      imports: [
        HttpClientTestingModule,
        MatDialogModule,
        TranslateModule.forRoot(),
        MatAutocompleteModule,
      ],
      providers: [FormBuilder, ProductService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddConcurrentUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
