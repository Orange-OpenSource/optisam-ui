// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupusrmanagementComponent } from './groupusrmanagement.component';
import { TranslateModule } from '@ngx-translate/core';
import { LoadingSpinnerComponent } from 'src/app/shared/loading-spinner/loading-spinner.component';
import { CustomMaterialModule } from 'src/app/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

describe('GroupusrmanagementComponent', () => {
  let component: GroupusrmanagementComponent;
  let fixture: ComponentFixture<GroupusrmanagementComponent>;
  const groupUsersList = [
    {
      "user_id": "parent.user@test.com",
      "first_name": "parent",
      "last_name": "user",
      "locale": "en",
      "role": "ADMIN"
    },
    {
      "user_id": "admin@test.com",
      "first_name": "Super_Admin",
      "last_name": "Admin",
      "locale": "en",
      "role": "SUPER_ADMIN"
    }
  ];

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        GroupusrmanagementComponent,
        LoadingSpinnerComponent
      ],
      imports: [
        CustomMaterialModule,
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupusrmanagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("page heading should contain 'Manage Users'", () => {
    const groupUsrMgmtHeading = fixture.nativeElement.querySelector('mat-card-title');
    expect(groupUsrMgmtHeading.innerText).toContain('Manage Users');
  })


  it("details of existing users of the group should be visible to all the users", () => {
    component.group.fullyQualifiedName = 'ParentGroup.SubGroup';
    component.dataSource = new MatTableDataSource(groupUsersList);
    component._loading = false;
    fixture.detectChanges();
    const tableHeaders = fixture.nativeElement.querySelectorAll('.mat-header-cell');
    const tableRowCells = fixture.nativeElement.querySelectorAll('.mat-cell');
    expect(tableHeaders.length).toBe(4);
    expect(tableRowCells.length).toBe(8);
  })

  it("user should be able to search user from the list of existing users", () => {
    component.group.fullyQualifiedName = 'ParentGroup.SubGroup';
    component.dataSource = new MatTableDataSource(groupUsersList);
    component._loading = false;
    component.applyFilter('parent');
    fixture.detectChanges();
    const tableRowCells = fixture.nativeElement.querySelectorAll('.mat-cell');
    expect(tableRowCells[2].innerText).toContain('parent');
  })

  it("option to 'Add User' or 'Delete User' should be visible to Admin/superAdmin users", () => {
    component.group.fullyQualifiedName = 'ParentGroup.SubGroup';
    component.dataSource = new MatTableDataSource(groupUsersList);
    component._loading = false;
    // component.role = 'ADMIN';
    fixture.detectChanges();
    const addUserBtn = fixture.nativeElement.querySelector('button#addUserBtn');
    const deleteUserBtn = fixture.nativeElement.querySelector('button#deleteUserBtn');
    expect(addUserBtn).toBeTruthy();
    expect(deleteUserBtn).toBeTruthy();
  })

  it("button 'Add User' should remain disabled when no new user is selected", () => {
    component.group.fullyQualifiedName = 'ParentGroup.SubGroup';
    component.dataSource = new MatTableDataSource(groupUsersList);
    component._loading = false;
    // component.role = 'SUPER_ADMIN';
    fixture.detectChanges();
    const addUserBtn = fixture.nativeElement.querySelector('button#addUserBtn');
    expect(addUserBtn.disabled).toBeTruthy();
  })

  it("button 'Add User' should be enabled when a new user is selected", () => {
    component.group.fullyQualifiedName = 'ParentGroup.SubGroup';
    component.dataSource = new MatTableDataSource(groupUsersList);
    component._loading = false;
    // component.role = 'SUPER_ADMIN';
    component.users.setValue(['new_user@test.com']);
    fixture.detectChanges();
    const addUserBtn = fixture.nativeElement.querySelector('button#addUserBtn');
    expect(addUserBtn.disabled).toBeFalsy();
  })

  it("button 'Delete User' should remain disabled when no existing user is selected", () => {
    component.group.fullyQualifiedName = 'ParentGroup.SubGroup';
    component.dataSource = new MatTableDataSource(groupUsersList);
    component._loading = false;
    // component.role = 'SUPER_ADMIN';
    fixture.detectChanges();
    const deleteUserBtn = fixture.nativeElement.querySelector('button#deleteUserBtn');
    expect(deleteUserBtn.disabled).toBeTruthy();
  })

  it("button 'Delete User' should be enabled when an existing user is selected", () => {
    component.group.fullyQualifiedName = 'ParentGroup.SubGroup';
    component.dataSource = new MatTableDataSource(groupUsersList);
    component._loading = false;
    // component.role = 'SUPER_ADMIN';
    component.usersToDelete = ['admin@test.com'];
    fixture.detectChanges();
    const deleteUserBtn = fixture.nativeElement.querySelector('button#deleteUserBtn');
    expect(deleteUserBtn.disabled).toBeFalsy();
  })

});
