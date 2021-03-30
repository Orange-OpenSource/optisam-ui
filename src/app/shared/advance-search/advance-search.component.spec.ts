// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvanceSearchComponent } from './advance-search.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { CustomMaterialModule } from 'src/app/material.module';
import { ProductrightsComponent } from 'src/app/modules/home/pages/acquiredrights/productrights/productrights.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from '../shared.module';
import { ProductService } from 'src/app/core/services/product.service';

describe('AdvanceSearchComponent', () => {
  let component: AdvanceSearchComponent;
  let fixture: ComponentFixture<ProductrightsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        ProductrightsComponent
      ],
      imports: [
        CustomMaterialModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        RouterTestingModule,
        FormsModule,
        SharedModule,
        TranslateModule.forRoot()
      ],
      providers: [
        ProductService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductrightsComponent);
    component = fixture.debugElement.children[0].componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Advance Search 
  it('search icon button should remain disabled if value in search-box has less than 3 characters', () => {
    const advSearchInput = fixture.nativeElement.querySelector('mat-form-field.search-form-field input#adv-search-input');
    advSearchInput.value = 'A_';
    advSearchInput.dispatchEvent(new Event('input'));
    const searchIcon = fixture.nativeElement.querySelector('button#search')
    expect(searchIcon.disabled).toBe(true);
  })

  it('search icon button should be enabled if value in search-box has >= 3 characters', () => {
    const advSearchInput = fixture.nativeElement.querySelector('mat-form-field.search-form-field input#adv-search-input');
    advSearchInput.value = 'A_Product';
    advSearchInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    const searchIcon = fixture.nativeElement.querySelector('button#search')
    expect(searchIcon.disabled).toBe(false);
  })

  it('clear icon button should be visible if there is some value in search-box', () => {
    const advSearchInput = fixture.nativeElement.querySelector('mat-form-field.search-form-field input#adv-search-input');
    advSearchInput.value = 'A_Product';
    advSearchInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    const clearBtn = fixture.nativeElement.querySelector('button#clear');
    expect(clearBtn).toBeTruthy();
  })
// TODO: test cases for Input & Output properties

  // it('clicking clear icon button should empty the contents of search-box', () => {
  //   const advSearchInput = fixture.nativeElement.querySelector('mat-form-field.search-form-field input#adv-search-input');
  //   advSearchInput.value = 'A_Product';
  //   advSearchInput.dispatchEvent(new Event('input'));
  //   fixture.detectChanges();
  //   const clearBtn = fixture.nativeElement.querySelector('button#clear');
  //   clearBtn.click();
  //   fixture.detectChanges();
  //   expect(advSearchInput.value).toBe('');
  // })

  it('clear button should not be visible if there is no value in search-box', () => {
    const advSearchInput = fixture.nativeElement.querySelector('mat-form-field.search-form-field input#adv-search-input');
    const clearBtn = fixture.nativeElement.querySelector('button#clear');
    expect(clearBtn).toBeFalsy();
  })

  it('drop-down list for additional filters should be opened on clicking expand button', () => {
    const toggleBtn = fixture.nativeElement.querySelector('button#toggleKeyDown');
    toggleBtn.click();
    fixture.detectChanges();
    const heading = fixture.nativeElement.querySelector('div.menu-title');
    expect(heading.innerText).toBe('Advance Search');
  })

});
