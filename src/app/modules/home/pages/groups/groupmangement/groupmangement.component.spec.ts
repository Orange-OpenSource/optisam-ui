// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupmangementComponent, DynamicDatabase } from './groupmangement.component';
import { TranslateModule } from '@ngx-translate/core';
import { LoadingSpinnerComponent } from 'src/app/shared/loading-spinner/loading-spinner.component';
import { CustomMaterialModule } from 'src/app/material.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('GroupmangementComponent', () => {
  let component: GroupmangementComponent;
  let fixture: ComponentFixture<GroupmangementComponent>;
  let groups;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ 
                      GroupmangementComponent,
                      LoadingSpinnerComponent
                    ],
      imports : [ 
                  CustomMaterialModule,
                  RouterTestingModule,
                  BrowserAnimationsModule,
                  HttpClientTestingModule,
                  TranslateModule.forRoot()
                ],
      providers:[
                  DynamicDatabase
                ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupmangementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("page heading should be 'Group Management'", () => {
        const viewGroupsHeading = fixture.nativeElement.querySelector('mat-card-title');
        expect(viewGroupsHeading.innerText).toBe('Group Management');
  })

  it("tree nodes should be displayed properly", () => {
        groups = [{"ID":"1","name":"Parent","fully_qualified_name":"Parent","scopes":["TST","TES","TET","DEM"],"num_of_child_groups":5,"num_of_users":2}];
        component.processTree();
        component._loading = false;
        component.role = 'ADMIN';
        fixture.detectChanges();
          component.dataSource.data = component.database.initialData(groups);
          const expandCollapseIcon = fixture.nativeElement.querySelector('.mat-icon-rtl-mirror')
          const groupName = fixture.nativeElement.querySelector('div#groupName')
          const users = fixture.nativeElement.querySelector('div#groupUsers')
          const scopes = fixture.nativeElement.querySelector('div#groupScopes')
          const deleteButton = fixture.nativeElement.querySelector('div#deleteButton')
          const addButton = fixture.nativeElement.querySelector('div#addButton')
          const editButton = fixture.nativeElement.querySelector('div#editButton')
          expect(expandCollapseIcon).toBeTruthy();
          expect(groupName.innerText).toBe('Parent');
          expect(users.innerText).toBe('2 users');
          expect(scopes.innerText).toBe('4 scopes');
          expect(deleteButton).toBeFalsy();
          expect(addButton).toBeTruthy();
          expect(editButton).toBeTruthy();
  })

  it("action options should be visible to the admin user", () => {
      groups = [{"ID":"1","name":"Parent","fully_qualified_name":"Parent","scopes":["TST","TES","TET","DEM"],"num_of_users":0,"num_of_child_groups":0}]
        component.processTree();
        component._loading = false;
        component.role = 'ADMIN';
        component.dataSource.data = component.database.initialData(groups);
        fixture.detectChanges();
          const deleteButton = fixture.nativeElement.querySelector('div#deleteButton')
          const addButton = fixture.nativeElement.querySelector('div#addButton')
          const editButton = fixture.nativeElement.querySelector('div#editButton')
          expect(deleteButton).toBeTruthy();
          expect(addButton).toBeTruthy();
          expect(editButton).toBeTruthy();
  })

  it("action options should be visible to the super admin user", () => {
      groups = [{"ID":"1","name":"Parent","fully_qualified_name":"Parent","scopes":["TST","TES","TET","DEM"],"num_of_users":0,"num_of_child_groups":0}]
        component.processTree();
        component._loading = false;
        component.role = 'SUPER_ADMIN';
        component.dataSource.data = component.database.initialData(groups);
        fixture.detectChanges();
          const deleteButton = fixture.nativeElement.querySelector('div#deleteButton')
          const addButton = fixture.nativeElement.querySelector('div#addButton')
          const editButton = fixture.nativeElement.querySelector('div#editButton')
          expect(deleteButton).toBeTruthy();
          expect(addButton).toBeTruthy();
          expect(editButton).toBeTruthy();
  })

  it("delete option should be visible to admin if the group is dormant", () => {
      groups = [{"ID":"1","name":"Parent","fully_qualified_name":"Parent","scopes":["TST","TES","TET","DEM"],"num_of_users":0,"num_of_child_groups":0}]
        component.processTree();
        component._loading = false;
        component.role = 'ADMIN';
        component.dataSource.data = component.database.initialData(groups);
        fixture.detectChanges();
          const deleteButton = fixture.nativeElement.querySelector('div#deleteButton')
          expect(deleteButton).toBeTruthy();
  })

  it("delete option should not be visible to admin if the group has children groups or active users", () => {
      groups = [{"ID":"1","name":"Parent","fully_qualified_name":"Parent","scopes":["TST","TES","TET","DEM"],"num_of_users":"2","num_of_child_groups":"3"}]
        component.processTree();
        component._loading = false;
        component.role = 'ADMIN';
        component.dataSource.data = component.database.initialData(groups);
        fixture.detectChanges();
          const deleteButton = fixture.nativeElement.querySelector('div#deleteButton')
          expect(deleteButton).toBeFalsy();
  })

  it("expand option should be visible if the group has children groups", () => {
      groups = [{"ID":"1","name":"Parent","fully_qualified_name":"Parent","scopes":["TST","TES","TET","DEM"],"num_of_users":"2","num_of_child_groups":"3"}]
        component.processTree();
        component._loading = false;
        component.role = 'ADMIN';
        component.dataSource.data = component.database.initialData(groups);
        fixture.detectChanges();
          const expandCollapseIcon = fixture.nativeElement.querySelector('.mat-icon-rtl-mirror')
          expect(expandCollapseIcon).toBeTruthy();
  })

  it("expand option should be visible if the group has children groups", () => {
      groups = [{"ID":"1","name":"Parent","fully_qualified_name":"Parent","scopes":["TST","TES","TET","DEM"],"num_of_users":0}]
        component.processTree();
        component._loading = false;
        component.role = 'ADMIN';
        component.dataSource.data = component.database.initialData(groups);
        fixture.detectChanges();
          const expandCollapseIcon = fixture.nativeElement.querySelector('.mat-icon-rtl-mirror')
          expect(expandCollapseIcon).toBeFalsy();
  })
});
