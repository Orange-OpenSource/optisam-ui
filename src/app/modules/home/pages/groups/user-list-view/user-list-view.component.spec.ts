import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserListViewComponent } from './user-list-view.component';
import { TranslateModule } from '@ngx-translate/core';
import { CustomMaterialModule } from 'src/app/material.module';
import { LoadingSpinnerComponent } from 'src/app/shared/loading-spinner/loading-spinner.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableDataSource } from '@angular/material/table';

describe('UserListViewComponent', () => {
  let component: UserListViewComponent;
  let fixture: ComponentFixture<UserListViewComponent>;
  const users = [{
    "first_name": "Super",
    "groups": ['India'],
    "last_name": "Admin",
    "locale": "en",
    "role": "SUPER_ADMIN",
    "user_id": "super_admin@test.com"
  },
  {
    "first_name": "Just",
    "groups": ['India'],
    "last_name": "Admin",
    "locale": "en",
    "role": "ADMIN",
    "user_id": "Admin@test.com"
  },
  {
    "first_name": "Normal",
    "groups": ['India'],
    "last_name": "User",
    "locale": "en",
    "role": "USER",
    "user_id": "User@test.com"
  }]
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        UserListViewComponent,
        LoadingSpinnerComponent
      ],
      imports: [
        BrowserAnimationsModule,
        CustomMaterialModule,
        HttpClientTestingModule,
        TranslateModule.forRoot()
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserListViewComponent);
    component = fixture.componentInstance;
    component.role = 'ADMIN';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("page heading should be 'User Management'", () => {
    const viewUsersListHeading = fixture.nativeElement.querySelector('div.page-heading');
    expect(viewUsersListHeading.innerText).toBe('User Management');
  })

  it("'Add User' button should be visible on the screen", () => {
    const addUserBtn = fixture.nativeElement.querySelector('button#addUserBtn');
    expect(addUserBtn).toBeTruthy();
  })

  it("edit user icon button should be visible on the screen", () => {
    component.loadData();
    component.dataSource = new MatTableDataSource(users);
    component._loading = false;
    fixture.detectChanges();
    const editUserBtn = fixture.nativeElement.querySelector('.mat-icon#editBtn_1');
    expect(editUserBtn).toBeTruthy();
  })

  it("delete user icon button should be visible on the screen", () => {
    component.loadData();
    component.dataSource = new MatTableDataSource(users);
    component._loading = false;
    fixture.detectChanges();
    const deleteUserBtn = fixture.nativeElement.querySelector('.mat-icon#deleteBtn_1');
    expect(deleteUserBtn).toBeTruthy();
  })

  it("action buttons should not be visible corresponding to Super Admin user in the list", () => {
    component.loadData();
    component.dataSource = new MatTableDataSource(users);
    component._loading = false;
    fixture.detectChanges();
    const editUserBtn = fixture.nativeElement.querySelector('.mat-icon#editBtn_0');;
    expect(editUserBtn).toBeFalsy();
    const deleteUserBtn = fixture.nativeElement.querySelector('.mat-icon#deleteBtn_0');
    expect(deleteUserBtn).toBeFalsy();
  })
});
