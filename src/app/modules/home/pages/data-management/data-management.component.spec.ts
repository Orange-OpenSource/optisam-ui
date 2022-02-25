import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataManagementComponent } from './data-management.component';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { CustomMaterialModule } from 'src/app/material.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DataManagementService } from 'src/app/core/services/data-management.service';

describe('DataManagementComponent', () => {
  let component: DataManagementComponent;
  let fixture: ComponentFixture<DataManagementComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DataManagementComponent ],
      imports: [
        CustomMaterialModule,
        RouterTestingModule,
        HttpClientTestingModule,
        TranslateModule.forRoot()
      ],
      providers: [
        DataManagementService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should display 'Data Management' as page heading", () => {
    const viewEquipListHeading = fixture.nativeElement.querySelector('div.page-heading');
    expect(viewEquipListHeading.innerText).toBe('Data Management');
  });

  it("should display button to delete inventory", () => {
    const deleteInventoryBtn = fixture.nativeElement.querySelector('button#deleteInventoryBtn');
    expect(deleteInventoryBtn).toBeTruthy();
  });

  it("should display tabs for 'Data' & 'Metadata'", () => {
    const allNavTabs = fixture.nativeElement.querySelectorAll('a.mat-tab-link');
    expect(allNavTabs).toBeTruthy();
    expect(allNavTabs[0].innerText).toContain('Data');
    expect(allNavTabs[1].innerText).toContain('Metadata');
  });
});
