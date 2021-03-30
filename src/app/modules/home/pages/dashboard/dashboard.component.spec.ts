// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DashboardComponent } from './dashboard.component';
import { TranslateModule } from '@ngx-translate/core';
import { CustomMaterialModule } from 'src/app/material.module';
import { ProductService } from 'src/app/core/services/product.service';
import { HttpClientModule } from '@angular/common/http';
import { EquipmentsService } from 'src/app/core/services/equipments.service';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from 'src/app/shared/shared.module';
import { SharedService } from 'src/app/shared/shared.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardComponent ],
      imports : [ 
        CustomMaterialModule,
        SharedModule,
        HttpClientModule,
        RouterTestingModule,
        FormsModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot() 
      ],
      providers: [
        ProductService,
        SharedService,
        EquipmentsService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  // Overview tab
  it("should have tab with label 'Overview'", () => {
    const firstTab = fixture.nativeElement.querySelector('.mat-tab-link');
    expect(firstTab.innerText).toBe('Overview');
  });
  
  it("should have all elements of 'Overview' displayed properly if it is the selected tab", () => {
    component.currentTab = 'Overview';
    const tileHeaders = fixture.nativeElement.querySelectorAll('.tileHeader');
    expect(tileHeaders[0].innerText).toBe('Compliance');
    expect(tileHeaders[1].innerText).toBe('Quality');
    expect(tileHeaders[2].innerText).toBe('Editors');
    expect(tileHeaders[3].innerText).toBe('Products');
    expect(tileHeaders[4].innerText).toBe('Owned Licenses');
    expect(tileHeaders[5].innerText).toBe('Maintenance Licenses');
    expect(tileHeaders[6].innerText).toBe('Software Licence Composition');
    expect(tileHeaders[7].innerText).toBe('Equipment Details');
    expect(tileHeaders[8].innerText).toBe('Number of Products Per Editor');
  })

  // Quality tab  
  it("should have tab with label 'Quality'", () => {
    const firstTab = fixture.nativeElement.querySelectorAll('.mat-tab-link')[1];
    expect(firstTab.innerText).toBe('Quality');
  });
  
  it("should have all elements of 'Quality' displayed properly if it is the selected tab", () => {
    component.currentTab = 'Quality';
    const tileHeaders = fixture.nativeElement.querySelectorAll('.tileHeader');
    expect(tileHeaders[9].innerText).toBe('Not Deployed Products');
    expect(tileHeaders[10].innerText).toBe('Not Licensed Products');
    expect(tileHeaders[11].innerText).toBe('Last Injection Failures(Last 30 days)');
    expect(tileHeaders[12].innerText).toBe('Development Rate Details');
    expect(tileHeaders[13].innerText).toBe('Injection Errors(Last 30 days)');
  })

  // Compliance tab  
  it("should have tab with label 'Compliance'", () => {
    const firstTab = fixture.nativeElement.querySelectorAll('.mat-tab-link')[2];
    expect(firstTab.innerText).toBe('Compliance');
  });
  
  it("should have all elements of 'Compliance' displayed properly if it is the selected tab", () => {
    component.currentTab = 'Compliance';
    const tileHeaders = fixture.nativeElement.querySelectorAll('.tileHeader');
    expect(tileHeaders[14].innerText).toBe('Overdeployment : Financial Volume');
    expect(tileHeaders[15].innerText).toBe('Counterfeiting : Financial Volume');
    expect(tileHeaders[16].innerText).toBe('Overdeployment : Number of License');
    expect(tileHeaders[17].innerText).toBe('Counterfeiting : Number of License');
  })
});
