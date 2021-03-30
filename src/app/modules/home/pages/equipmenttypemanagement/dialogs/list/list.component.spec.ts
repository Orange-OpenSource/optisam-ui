// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListComponent } from './list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CustomMaterialModule } from 'src/app/material.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { EquipmentTypeManagementService } from 'src/app/core/services/equipmenttypemanagement.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListComponent],
      imports: [
        ReactiveFormsModule,
        CustomMaterialModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot()
      ],
      providers: [
        EquipmentTypeManagementService,
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("page heading should be 'Attribute List for {equipment-name}'", () => {
    component.equipName = 'Test_Equip'
    fixture.detectChanges();
    const listAttrHeading = fixture.nativeElement.querySelector('mat-card-title');
    expect(listAttrHeading.innerText).toBe('Attribute List for Test_Equip');
  })

  it('all attributes and their values should be displayed in a table', () => {
    component.equipName = 'Test_Equip'
    component.attribute = [
      { "ID": "x101a", "name": "abc_name", "data_type": "STRING", "primary_key": true, "displayed": true, "searchable": true, "mapped_to": "abc_name" },
      { "ID": "x102a", "name": "xyz_name", "data_type": "STRING", "primary_key": true, "displayed": true, "searchable": true, "mapped_to": "xyz_name" }
    ]
    fixture.detectChanges();
    const headerCells = fixture.nativeElement.querySelectorAll('mat-header-cell');
    expect(headerCells.length).toBe(5);
    expect(headerCells[0].innerText).toBe('Name');
    expect(headerCells[1].innerText).toBe('DataType');
    expect(headerCells[2].innerText).toBe('Mapped Column');
    expect(headerCells[3].innerText).toBe('Searchable');
    expect(headerCells[4].innerText).toBe('Displayable');
  })

  it('cancel button should be visible on the screen', () => {
    const cancelButton = fixture.nativeElement.querySelector('button#cancelButton');
    expect(cancelButton).toBeTruthy();
  })
});
