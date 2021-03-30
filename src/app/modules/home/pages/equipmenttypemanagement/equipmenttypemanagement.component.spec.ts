// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmenttypemanagementComponent } from './equipmenttypemanagement.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { CustomMaterialModule } from 'src/app/material.module';
import { EquipmentTypeManagementService } from 'src/app/core/services/equipmenttypemanagement.service';
import { LoadingSpinnerComponent } from 'src/app/shared/loading-spinner/loading-spinner.component';
import { MatTableDataSource } from '@angular/material/table';

describe('EquipmenttypemanagementComponent', () => {
  let component: EquipmenttypemanagementComponent;
  let fixture: ComponentFixture<EquipmenttypemanagementComponent>;
  const equipTypes = [
    {
      "ID": "x101",
      "type": "abc",
      "metadata_id": "a10",
      "metadata_source": "metadata_abc.csv",
      "attributes": [
        { "ID": "x101a", "name": "abc_name", "data_type": "STRING", "primary_key": true, "displayed": true, "searchable": true, "mapped_to": "abc_name" }
      ]
    },
    {
      "ID": "x102",
      "type": "xyz",
      "parent_id": "x101",
      "parent_type": "abc",
      "metadata_id": "a12",
      "metadata_source": "metadata_xyz.csv",
      "attributes": [
        { "ID": "x102a", "name": "xyz_name", "data_type": "STRING", "primary_key": true, "displayed": true, "searchable": true, "mapped_to": "xyz_name" },
        { "ID": "x102b", "name": "parent_id", "data_type": "STRING", "displayed": true, "parent_identifier": true, "mapped_to": "parent_id" }
      ]
    }
  ]

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        EquipmenttypemanagementComponent,
        LoadingSpinnerComponent
      ],
      imports: [
        CustomMaterialModule,
        RouterTestingModule,
        HttpClientTestingModule,
        TranslateModule.forRoot()
      ],
      providers: [
        EquipmentTypeManagementService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipmenttypemanagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("page heading should be 'Equipment Management'", () => {
    const viewEquipListHeading = fixture.nativeElement.querySelector('div.page-heading');
    expect(viewEquipListHeading.innerText).toBe('Equipment Management');
  })

  it("'Add Equipment Type' button should be visible to Admin user", () => {
    component.role = 'ADMIN';
    fixture.detectChanges();
    const addEqpBtn = fixture.nativeElement.querySelector('button#addEqpBtn');
    expect(addEqpBtn).toBeTruthy();
  })

  it("'Add Equipment Type' button should be visible to Super Admin user", () => {
    component.role = 'SUPER_ADMIN';
    fixture.detectChanges();
    const addEqpBtn = fixture.nativeElement.querySelector('button#addEqpBtn');
    expect(addEqpBtn).toBeTruthy();
  })

  it("'Add Equipment Type' button should not be visible to normal user", () => {
    component.role = 'USER';
    fixture.detectChanges();
    const addEqpBtn = fixture.nativeElement.querySelector('button#addEqpBtn');
    expect(addEqpBtn).toBeFalsy();
  })

  it('attributes count should be clickable', () => {
    component.MyDataSource = new MatTableDataSource(equipTypes);
    fixture.detectChanges();
    const attrLink = fixture.nativeElement.querySelector('a.mat-button-link');
    expect(attrLink).toBeTruthy();
  })

  it('edit equipment type option should be available to Admin user', () => {
    component.MyDataSource = new MatTableDataSource(equipTypes);
    component.role = 'ADMIN';
    fixture.detectChanges();
    const editBtn = fixture.nativeElement.querySelector('button#editBtn0');
    expect(editBtn).toBeTruthy();
  })

  it('edit equipment type option should be available to Super Admin user', () => {
    component.MyDataSource = new MatTableDataSource(equipTypes);
    component.role = 'SUPER_ADMIN';
    fixture.detectChanges();
    const editBtn = fixture.nativeElement.querySelector('button#editBtn0');
    expect(editBtn).toBeTruthy();
  })

  it('edit equipment type option should not be available to normal user', () => {
    component.MyDataSource = new MatTableDataSource(equipTypes);
    component.role = 'USER';
    fixture.detectChanges();
    const editBtn = fixture.nativeElement.querySelector('button#editBtn0');
    expect(editBtn).toBeFalsy();
  })
});
