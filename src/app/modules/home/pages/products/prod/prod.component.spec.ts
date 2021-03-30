// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdComponent } from './prod.component';
import { TranslateModule } from '@ngx-translate/core';
import { CustomMaterialModule } from 'src/app/material.module';
import { FormsModule } from '@angular/forms';
import { ProductService } from 'src/app/core/services/product.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { MoreDetailsComponent } from '../../../dialogs/product-details/more-details.component';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export class ProductServiceStub {
  getProducts(pageSize, length) {
    if (pageSize == 10) {
      if (length == 1) {
        return of({
          totalRecords: 12,
          products: [
            { swidTag: "A_Swidtag", name: "A_Product", editor: "A_Editor", category: "A_Category", numofEquipments: 5 },
            { swidTag: "C_Swidtag", name: "C_Product", editor: "C_Editor", category: "C_Category", numofEquipments: 15 },
            { swidTag: "D_Swidtag", name: "D_Product", editor: "D_Editor", category: "D_Category", totalCost: "100", numOfApplications: 20 },
            { swidTag: "B_Swidtag", name: "B_Product", editor: "B_Editor", version: "B_Version", category: "B_Category", numofEquipments: 10 },
            { swidTag: "G_Swidtag", name: "G_Product", editor: "G_Editor", category: "G_Category", numofEquipments: 7 },
            { swidTag: "I_Swidtag", name: "I_Product", editor: "I_Editor", category: "I_Category", numofEquipments: 17 },
            { swidTag: "K_Swidtag", name: "K_Product", editor: "K_Editor", category: "K_Category", totalCost: "100", numOfApplications: 20 },
            { swidTag: "H_Swidtag", name: "H_Product", editor: "H_Editor", version: "H_Version", category: "H_Category", numofEquipments: 10 },
            { swidTag: "E_Swidtag", name: "E_Product", editor: "E_Editor", category: "E_Category", numofEquipments: 1 },
            { swidTag: "J_Swidtag", name: "J_Product", editor: "J_Editor", category: "J_Category", numofEquipments: 9 }
          ]
        });
      } else {
        return of({
          totalRecords: 12,
          products: [
            { swidTag: "F_Swidtag", name: "F_Product", editor: "F_Editor", category: "F_Category", totalCost: "100", numOfApplications: 20 },
            { swidTag: "L_Swidtag", name: "L_Product", editor: "L_Editor", version: "L_Version", category: "L_Category", numofEquipments: 10 }
          ]
        });
      }
    } else {
      return of({
        totalRecords: 12,
        products: [
          { swidTag: "A_Swidtag", name: "A_Product", editor: "A_Editor", category: "A_Category", numofEquipments: 5 },
          { swidTag: "C_Swidtag", name: "C_Product", editor: "C_Editor", category: "C_Category", numofEquipments: 15 },
          { swidTag: "D_Swidtag", name: "D_Product", editor: "D_Editor", category: "D_Category", totalCost: "100", numOfApplications: 20 },
          { swidTag: "B_Swidtag", name: "B_Product", editor: "B_Editor", version: "B_Version", category: "B_Category", numofEquipments: 10 },
          { swidTag: "G_Swidtag", name: "G_Product", editor: "G_Editor", category: "G_Category", numofEquipments: 7 },
          { swidTag: "I_Swidtag", name: "I_Product", editor: "I_Editor", category: "I_Category", numofEquipments: 17 },
          { swidTag: "K_Swidtag", name: "K_Product", editor: "K_Editor", category: "K_Category", totalCost: "100", numOfApplications: 20 },
          { swidTag: "H_Swidtag", name: "H_Product", editor: "H_Editor", version: "H_Version", category: "H_Category", numofEquipments: 10 },
          { swidTag: "E_Swidtag", name: "E_Product", editor: "E_Editor", category: "E_Category", numofEquipments: 1 },
          { swidTag: "J_Swidtag", name: "J_Product", editor: "J_Editor", category: "J_Category", numofEquipments: 9 },
          { swidTag: "F_Swidtag", name: "F_Product", editor: "F_Editor", category: "F_Category", totalCost: "100", numOfApplications: 20 },
          { swidTag: "L_Swidtag", name: "L_Product", editor: "L_Editor", version: "L_Version", category: "L_Category", numofEquipments: 10 }
        ]
      });
    }
  }
  getMoreDetails() {
    return of({ "swidTag": "ADOBE8", "editor": "ADOBE" });
  }
  filteredData(length, pageSize, sort_by, sort_order, filteringkey1, filteringkey2, filteringkey3) {
    if (sort_by == 'swidtag') {
      if (sort_order == 'asc') {
        if (pageSize == 10) {
          if (length == 1) {
            return of({
              totalRecords: 12,
              products: [
                { swidTag: "A_Swidtag", name: "A_Product", editor: "A_Editor", category: "A_Category", numofEquipments: 5 },
                { swidTag: "B_Swidtag", name: "B_Product", editor: "B_Editor", version: "B_Version", category: "B_Category", numofEquipments: 10 },
                { swidTag: "C_Swidtag", name: "C_Product", editor: "C_Editor", category: "C_Category", numofEquipments: 15 },
                { swidTag: "D_Swidtag", name: "D_Product", editor: "D_Editor", category: "D_Category", totalCost: "100", numOfApplications: 20 },
                { swidTag: "E_Swidtag", name: "E_Product", editor: "E_Editor", category: "E_Category", numofEquipments: 1 },
                { swidTag: "F_Swidtag", name: "F_Product", editor: "F_Editor", category: "F_Category", totalCost: "100", numOfApplications: 20 },
                { swidTag: "G_Swidtag", name: "G_Product", editor: "G_Editor", category: "G_Category", numofEquipments: 7 },
                { swidTag: "H_Swidtag", name: "H_Product", editor: "H_Editor", version: "H_Version", category: "H_Category", numofEquipments: 10 },
                { swidTag: "I_Swidtag", name: "I_Product", editor: "I_Editor", category: "I_Category", numofEquipments: 17 },
                { swidTag: "J_Swidtag", name: "J_Product", editor: "J_Editor", category: "J_Category", numofEquipments: 9 }
              ]
            });
          } else {
            return of({
              totalRecords: 12,
              products: [
                { swidTag: "K_Swidtag", name: "K_Product", editor: "K_Editor", category: "K_Category", totalCost: "100", numOfApplications: 20 },
                { swidTag: "L_Swidtag", name: "L_Product", editor: "L_Editor", version: "L_Version", category: "L_Category", numofEquipments: 10 }
              ]
            });
          }
        }
        else {
          return of({
            totalRecords: 12,
            products: [
              { swidTag: "A_Swidtag", name: "A_Product", editor: "A_Editor", category: "A_Category", numofEquipments: 5 },
              { swidTag: "B_Swidtag", name: "B_Product", editor: "B_Editor", version: "B_Version", category: "B_Category", numofEquipments: 10 },
              { swidTag: "C_Swidtag", name: "C_Product", editor: "C_Editor", category: "C_Category", numofEquipments: 15 },
              { swidTag: "D_Swidtag", name: "D_Product", editor: "D_Editor", category: "D_Category", totalCost: "100", numOfApplications: 20 },
              { swidTag: "E_Swidtag", name: "E_Product", editor: "E_Editor", category: "E_Category", numofEquipments: 1 },
              { swidTag: "F_Swidtag", name: "F_Product", editor: "F_Editor", category: "F_Category", totalCost: "100", numOfApplications: 20 },
              { swidTag: "G_Swidtag", name: "G_Product", editor: "G_Editor", category: "G_Category", numofEquipments: 7 },
              { swidTag: "H_Swidtag", name: "H_Product", editor: "H_Editor", version: "H_Version", category: "H_Category", numofEquipments: 10 },
              { swidTag: "I_Swidtag", name: "I_Product", editor: "I_Editor", category: "I_Category", numofEquipments: 17 },
              { swidTag: "J_Swidtag", name: "J_Product", editor: "J_Editor", category: "J_Category", numofEquipments: 9 },
              { swidTag: "K_Swidtag", name: "K_Product", editor: "K_Editor", category: "K_Category", totalCost: "100", numOfApplications: 20 },
              { swidTag: "L_Swidtag", name: "L_Product", editor: "L_Editor", version: "L_Version", category: "L_Category", numofEquipments: 10 }
            ]
          });
        }
      }
      else if (sort_order == 'desc') {
        if (pageSize == 10) {
          if (length == 1) {
            return of({
              totalRecords: 12,
              products: [
                { swidTag: "L_Swidtag", name: "L_Product", editor: "L_Editor", version: "L_Version", category: "L_Category", numofEquipments: 10 },
                { swidTag: "K_Swidtag", name: "K_Product", editor: "K_Editor", category: "K_Category", totalCost: "100", numOfApplications: 20 },
                { swidTag: "J_Swidtag", name: "J_Product", editor: "J_Editor", category: "J_Category", numofEquipments: 9 },
                { swidTag: "I_Swidtag", name: "I_Product", editor: "I_Editor", category: "I_Category", numofEquipments: 17 },
                { swidTag: "H_Swidtag", name: "H_Product", editor: "H_Editor", version: "H_Version", category: "H_Category", numofEquipments: 10 },
                { swidTag: "G_Swidtag", name: "G_Product", editor: "G_Editor", category: "G_Category", numofEquipments: 7 },
                { swidTag: "F_Swidtag", name: "F_Product", editor: "F_Editor", category: "F_Category", totalCost: "100", numOfApplications: 20 },
                { swidTag: "E_Swidtag", name: "E_Product", editor: "E_Editor", category: "E_Category", numofEquipments: 1 },
                { swidTag: "D_Swidtag", name: "D_Product", editor: "D_Editor", category: "D_Category", totalCost: "100", numOfApplications: 20 },
                { swidTag: "C_Swidtag", name: "C_Product", editor: "C_Editor", category: "C_Category", numofEquipments: 15 }
              ]
            });
          } else {
            return of({
              totalRecords: 12,
              products: [
                { swidTag: "B_Swidtag", name: "B_Product", editor: "B_Editor", version: "B_Version", category: "B_Category", numofEquipments: 10 },
                { swidTag: "A_Swidtag", name: "A_Product", editor: "A_Editor", category: "A_Category", numofEquipments: 5 }
              ]
            });
          }
        } else {
          return of({
            totalRecords: 12,
            products: [
              { swidTag: "L_Swidtag", name: "L_Product", editor: "L_Editor", version: "L_Version", category: "L_Category", numofEquipments: 10 },
              { swidTag: "K_Swidtag", name: "K_Product", editor: "K_Editor", category: "K_Category", totalCost: "100", numOfApplications: 20 },
              { swidTag: "J_Swidtag", name: "J_Product", editor: "J_Editor", category: "J_Category", numofEquipments: 9 },
              { swidTag: "I_Swidtag", name: "I_Product", editor: "I_Editor", category: "I_Category", numofEquipments: 17 },
              { swidTag: "H_Swidtag", name: "H_Product", editor: "H_Editor", version: "H_Version", category: "H_Category", numofEquipments: 10 },
              { swidTag: "G_Swidtag", name: "G_Product", editor: "G_Editor", category: "G_Category", numofEquipments: 7 },
              { swidTag: "F_Swidtag", name: "F_Product", editor: "F_Editor", category: "F_Category", totalCost: "100", numOfApplications: 20 },
              { swidTag: "E_Swidtag", name: "E_Product", editor: "E_Editor", category: "E_Category", numofEquipments: 1 },
              { swidTag: "D_Swidtag", name: "D_Product", editor: "D_Editor", category: "D_Category", totalCost: "100", numOfApplications: 20 },
              { swidTag: "C_Swidtag", name: "C_Product", editor: "C_Editor", category: "C_Category", numofEquipments: 15 },
              { swidTag: "B_Swidtag", name: "B_Product", editor: "B_Editor", version: "B_Version", category: "B_Category", numofEquipments: 10 },
              { swidTag: "A_Swidtag", name: "A_Product", editor: "A_Editor", category: "A_Category", numofEquipments: 5 }
            ]
          });
        }
      }
      else {
        if (pageSize == 10) {
          if (length == 1) {
            return of({
              totalRecords: 12,
              products: [
                { swidTag: "A_Swidtag", name: "A_Product", editor: "A_Editor", category: "A_Category", numofEquipments: 5 },
                { swidTag: "C_Swidtag", name: "C_Product", editor: "C_Editor", category: "C_Category", numofEquipments: 15 },
                { swidTag: "D_Swidtag", name: "D_Product", editor: "D_Editor", category: "D_Category", totalCost: "100", numOfApplications: 20 },
                { swidTag: "B_Swidtag", name: "B_Product", editor: "B_Editor", version: "B_Version", category: "B_Category", numofEquipments: 10 },
                { swidTag: "G_Swidtag", name: "G_Product", editor: "G_Editor", category: "G_Category", numofEquipments: 7 },
                { swidTag: "I_Swidtag", name: "I_Product", editor: "I_Editor", category: "I_Category", numofEquipments: 17 },
                { swidTag: "K_Swidtag", name: "K_Product", editor: "K_Editor", category: "K_Category", totalCost: "100", numOfApplications: 20 },
                { swidTag: "H_Swidtag", name: "H_Product", editor: "H_Editor", version: "H_Version", category: "H_Category", numofEquipments: 10 },
                { swidTag: "E_Swidtag", name: "E_Product", editor: "E_Editor", category: "E_Category", numofEquipments: 1 },
                { swidTag: "J_Swidtag", name: "J_Product", editor: "J_Editor", category: "J_Category", numofEquipments: 9 }
              ]
            });
          } else {
            return of({
              totalRecords: 12,
              products: [
                { swidTag: "F_Swidtag", name: "F_Product", editor: "F_Editor", category: "F_Category", totalCost: "100", numOfApplications: 20 },
                { swidTag: "L_Swidtag", name: "L_Product", editor: "L_Editor", version: "L_Version", category: "L_Category", numofEquipments: 10 }
              ]
            });
          }
        } else {
          return of({
            totalRecords: 12,
            products: [
              { swidTag: "A_Swidtag", name: "A_Product", editor: "A_Editor", category: "A_Category", numofEquipments: 5 },
              { swidTag: "C_Swidtag", name: "C_Product", editor: "C_Editor", category: "C_Category", numofEquipments: 15 },
              { swidTag: "D_Swidtag", name: "D_Product", editor: "D_Editor", category: "D_Category", totalCost: "100", numOfApplications: 20 },
              { swidTag: "B_Swidtag", name: "B_Product", editor: "B_Editor", version: "B_Version", category: "B_Category", numofEquipments: 10 },
              { swidTag: "G_Swidtag", name: "G_Product", editor: "G_Editor", category: "G_Category", numofEquipments: 7 },
              { swidTag: "I_Swidtag", name: "I_Product", editor: "I_Editor", category: "I_Category", numofEquipments: 17 },
              { swidTag: "K_Swidtag", name: "K_Product", editor: "K_Editor", category: "K_Category", totalCost: "100", numOfApplications: 20 },
              { swidTag: "H_Swidtag", name: "H_Product", editor: "H_Editor", version: "H_Version", category: "H_Category", numofEquipments: 10 },
              { swidTag: "E_Swidtag", name: "E_Product", editor: "E_Editor", category: "E_Category", numofEquipments: 1 },
              { swidTag: "J_Swidtag", name: "J_Product", editor: "J_Editor", category: "J_Category", numofEquipments: 9 },
              { swidTag: "F_Swidtag", name: "F_Product", editor: "F_Editor", category: "F_Category", totalCost: "100", numOfApplications: 20 },
              { swidTag: "L_Swidtag", name: "L_Product", editor: "L_Editor", version: "L_Version", category: "L_Category", numofEquipments: 10 }
            ]
          });
        }
      }
    }
    else {
      if (pageSize == 10) {
        if (length == 1) {
          return of({
            totalRecords: 12,
            products: [
              { swidTag: "A_Swidtag", name: "A_Product", editor: "A_Editor", category: "A_Category", numofEquipments: 5 },
              { swidTag: "C_Swidtag", name: "C_Product", editor: "C_Editor", category: "C_Category", numofEquipments: 15 },
              { swidTag: "D_Swidtag", name: "D_Product", editor: "D_Editor", category: "D_Category", totalCost: "100", numOfApplications: 20 },
              { swidTag: "B_Swidtag", name: "B_Product", editor: "B_Editor", version: "B_Version", category: "B_Category", numofEquipments: 10 },
              { swidTag: "G_Swidtag", name: "G_Product", editor: "G_Editor", category: "G_Category", numofEquipments: 7 },
              { swidTag: "I_Swidtag", name: "I_Product", editor: "I_Editor", category: "I_Category", numofEquipments: 17 },
              { swidTag: "K_Swidtag", name: "K_Product", editor: "K_Editor", category: "K_Category", totalCost: "100", numOfApplications: 20 },
              { swidTag: "H_Swidtag", name: "H_Product", editor: "H_Editor", version: "H_Version", category: "H_Category", numofEquipments: 10 },
              { swidTag: "E_Swidtag", name: "E_Product", editor: "E_Editor", category: "E_Category", numofEquipments: 1 },
              { swidTag: "J_Swidtag", name: "J_Product", editor: "J_Editor", category: "J_Category", numofEquipments: 9 }
            ]
          });
        } else {
          return of({
            totalRecords: 12,
            products: [
              { swidTag: "F_Swidtag", name: "F_Product", editor: "F_Editor", category: "F_Category", totalCost: "100", numOfApplications: 20 },
              { swidTag: "L_Swidtag", name: "L_Product", editor: "L_Editor", version: "L_Version", category: "L_Category", numofEquipments: 10 }
            ]
          });
        }
      } else {
        return of({
          totalRecords: 12,
          products: [
            { swidTag: "A_Swidtag", name: "A_Product", editor: "A_Editor", category: "A_Category", numofEquipments: 5 },
            { swidTag: "C_Swidtag", name: "C_Product", editor: "C_Editor", category: "C_Category", numofEquipments: 15 },
            { swidTag: "D_Swidtag", name: "D_Product", editor: "D_Editor", category: "D_Category", totalCost: "100", numOfApplications: 20 },
            { swidTag: "B_Swidtag", name: "B_Product", editor: "B_Editor", version: "B_Version", category: "B_Category", numofEquipments: 10 },
            { swidTag: "G_Swidtag", name: "G_Product", editor: "G_Editor", category: "G_Category", numofEquipments: 7 },
            { swidTag: "I_Swidtag", name: "I_Product", editor: "I_Editor", category: "I_Category", numofEquipments: 17 },
            { swidTag: "K_Swidtag", name: "K_Product", editor: "K_Editor", category: "K_Category", totalCost: "100", numOfApplications: 20 },
            { swidTag: "H_Swidtag", name: "H_Product", editor: "H_Editor", version: "H_Version", category: "H_Category", numofEquipments: 10 },
            { swidTag: "E_Swidtag", name: "E_Product", editor: "E_Editor", category: "E_Category", numofEquipments: 1 },
            { swidTag: "J_Swidtag", name: "J_Product", editor: "J_Editor", category: "J_Category", numofEquipments: 9 },
            { swidTag: "F_Swidtag", name: "F_Product", editor: "F_Editor", category: "F_Category", totalCost: "100", numOfApplications: 20 },
            { swidTag: "L_Swidtag", name: "L_Product", editor: "L_Editor", version: "L_Version", category: "L_Category", numofEquipments: 10 }
          ]
        });
      }
    }

  }

  getPaginatorData(event) {
    this.filteredData(event.pageIndex + 1, event.pageSize, '', '', '', '', '');
  }

  advSearchTrigger(event) {
    console.log('event : ', event)
  }
}
describe('ProdComponent', () => {
  let component: ProdComponent;
  let fixture: ComponentFixture<ProdComponent>;
  const tableColumns = ["swidTag", "name", "editor", "version", "edition", "totalCost", "numOfApplications", "numofEquipments"];
  const SwidTagUnsorted = ['A_Swidtag', 'C_Swidtag', 'D_Swidtag', 'B_Swidtag', 'G_Swidtag', 'I_Swidtag', 'K_Swidtag', 'H_Swidtag', 'E_Swidtag', 'J_Swidtag', 'F_Swidtag', 'L_Swidtag'];
  const SwidTagSortedAsc = ['A_Swidtag', 'B_Swidtag', 'C_Swidtag', 'D_Swidtag', 'E_Swidtag', 'F_Swidtag', 'G_Swidtag', 'H_Swidtag', 'I_Swidtag', 'J_Swidtag', 'K_Swidtag', 'L_Swidtag'];
  const SwidTagSortedDesc = ['L_Swidtag', 'K_Swidtag', 'J_Swidtag', 'I_Swidtag', 'H_Swidtag', 'G_Swidtag', 'F_Swidtag', 'E_Swidtag', 'D_Swidtag', 'C_Swidtag', 'B_Swidtag', 'A_Swidtag'];
  const dialogMock = {
    close: () => { }
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        ProdComponent,
        MoreDetailsComponent
      ],
      imports: [
        CustomMaterialModule,
        FormsModule,
        HttpClientTestingModule,
        RouterTestingModule,
        BrowserAnimationsModule,
        SharedModule,
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: ProductService, useClass: ProductServiceStub },
        { provide: MatDialogRef, useValue: dialogMock },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .overrideModule(BrowserDynamicTestingModule, {
        set: { entryComponents: [MoreDetailsComponent] }
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have "productList" populated ', () => {
    expect(component.MyDataSource.data.length).toBeGreaterThan(0);
  });

  it('should display all columns', () => {
    let headerRow = fixture.nativeElement.querySelectorAll('mat-header-row');
    expect(component.displayedColumns.length).toBe(tableColumns.length);

    // Header columns
    expect(headerRow[0].children[0].innerText).toBe('SWIDtag');
    expect(headerRow[0].children[1].innerText).toBe('Product name');
    expect(headerRow[0].children[2].innerText).toBe('Version');
    expect(headerRow[0].children[3].innerText).toBe('Editor name');
    expect(headerRow[0].children[4].innerText).toBe('Edition');
    expect(headerRow[0].children[5].innerText).toBe('Total cost(€)');
    expect(headerRow[0].children[6].innerText).toBe('Application Count');
    expect(headerRow[0].children[7].innerText).toBe('Equipment Count');
  });

  it('should display all rows', () => {
    let tableRows = fixture.nativeElement.querySelectorAll('mat-row');
    // Test row 1
    let row1 = tableRows[0];
    expect(row1.children[0].innerText).toBe('A_Swidtag');
    expect(row1.children[1].innerText).toBe('A_Product');
    expect(row1.children[2].innerText).toBe('');
    expect(row1.children[3].innerText).toBe('A_Editor');
    expect(row1.children[4].innerText).toBe('A_Category');
    expect(row1.children[5].innerText).toBe('0.00');
    expect(row1.children[6].innerText).toBe('0');
    expect(row1.children[7].innerText).toBe('5');
    // Test row 2
    let row2 = tableRows[1];
    expect(row2.children[0].innerText).toBe('C_Swidtag');
    expect(row2.children[1].innerText).toBe('C_Product');
    expect(row2.children[2].innerText).toBe('');
    expect(row2.children[3].innerText).toBe('C_Editor');
    expect(row2.children[4].innerText).toBe('C_Category');
    expect(row2.children[5].innerText).toBe('0.00');
    expect(row2.children[6].innerText).toBe('0');
    expect(row2.children[7].innerText).toBe('15');
    // Test row 3
    let row3 = tableRows[2];
    expect(row3.children[0].innerText).toBe('D_Swidtag');
    expect(row3.children[1].innerText).toBe('D_Product');
    expect(row3.children[2].innerText).toBe('');
    expect(row3.children[3].innerText).toBe('D_Editor');
    expect(row3.children[4].innerText).toBe('D_Category');
    expect(row3.children[5].innerText).toBe('100.00');
    expect(row3.children[6].innerText).toBe('20');
    expect(row3.children[7].innerText).toBe('0');
    // Test row 4
    let row4 = tableRows[3];
    expect(row4.children[0].innerText).toBe('B_Swidtag');
    expect(row4.children[1].innerText).toBe('B_Product');
    expect(row4.children[2].innerText).toBe('B_Version');
    expect(row4.children[3].innerText).toBe('B_Editor');
    expect(row4.children[4].innerText).toBe('B_Category');
    expect(row4.children[5].innerText).toBe('0.00');
    expect(row4.children[6].innerText).toBe('0');
    expect(row4.children[7].innerText).toBe('10');
  });

  it('data should get sorted', () => {
    const tableRows = fixture.nativeElement.querySelectorAll('mat-row');
    const sortButtons = fixture.nativeElement.querySelectorAll('.mat-sort-header-arrow');
    expect(sortButtons.length).toBe(8);
    // Swidtag Unsorted 
    for (let i = 0; i < tableRows.length; i++) {
      expect(tableRows[i].children[0].innerText).toBe(SwidTagUnsorted[i]);
    }
    // Swidtag SortOrder ASC
    sortButtons[0].click();
    fixture.detectChanges();
    const ascSortedTableRows = fixture.nativeElement.querySelectorAll('mat-row')
    for (let i = 0; i < ascSortedTableRows.length; i++) {
      expect(ascSortedTableRows[i].children[0].innerText).toBe(SwidTagSortedAsc[i]);
    }
    // Swidtag SortOrder DESC
    sortButtons[0].click();
    fixture.detectChanges();
    const descSortedTableRows = fixture.nativeElement.querySelectorAll('mat-row')
    for (let i = 0; i < descSortedTableRows.length; i++) {
      expect(descSortedTableRows[i].children[0].innerText).toBe(SwidTagSortedDesc[i]);
    }
  })
  // Pagination test cases
  it('page size should work', () => {
    const rangeLabel_10 = fixture.nativeElement.querySelector('.mat-paginator-range-label');
    expect(rangeLabel_10.innerText).toContain('10 of 12');

    component.paginator.pageSize = 20;
    fixture.detectChanges();
    const rangeLabel_20 = fixture.nativeElement.querySelector('.mat-paginator-range-label');
    expect(rangeLabel_20.innerText).toContain('12 of 12');
  })

  it('next page button should work', () => {
    const nextBtn = fixture.nativeElement.querySelector('.mat-paginator-navigation-next');
    nextBtn.click();
    fixture.detectChanges();
    expect(component.MyDataSource.data.length).toBe(2);
  })

  it('last page button should work', () => {
    const lastBtn = fixture.nativeElement.querySelector('.mat-paginator-navigation-last');
    lastBtn.click();
    fixture.detectChanges();
    expect(component.MyDataSource.data.length).toBe(2);
  })

  it('previous page button should work', () => {
    const nextBtn = fixture.nativeElement.querySelector('.mat-paginator-navigation-next');
    nextBtn.click();
    fixture.detectChanges();
    const prevBtn = fixture.nativeElement.querySelector('.mat-paginator-navigation-previous');
    prevBtn.click();
    fixture.detectChanges();
    expect(component.MyDataSource.data.length).toBe(10);
  })

  it('first page button should work', () => {
    const nextBtn = fixture.nativeElement.querySelector('.mat-paginator-navigation-next');
    nextBtn.click();
    fixture.detectChanges();
    const prevBtn = fixture.nativeElement.querySelector('.mat-paginator-navigation-first');
    prevBtn.click();
    fixture.detectChanges();
    expect(component.MyDataSource.data.length).toBe(10);
  })
});
