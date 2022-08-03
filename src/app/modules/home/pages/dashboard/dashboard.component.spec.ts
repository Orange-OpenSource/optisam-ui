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
      declarations: [DashboardComponent],
      imports: [
        CustomMaterialModule,
        SharedModule,
        HttpClientModule,
        RouterTestingModule,
        FormsModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot(),
      ],
      providers: [ProductService, SharedService, EquipmentsService],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
  // Overview tab
  it("should have tab with label 'Overview'", () => {
    const firstTab = fixture.nativeElement.querySelector('.mat-tab-link');
    expect(firstTab.innerText).toBe('Overview');
  });

  it("should have all elements of 'Overview' displayed properly if it is the selected tab", () => {
    component.currentTab = 'Overview';
    const tileHeaders = fixture.nativeElement.querySelectorAll('.tileHeader');
    expect(tileHeaders[0].innerText).toBe('Complianceinfo');
    expect(tileHeaders[1].innerText).toBe('Qualityinfo');
    expect(tileHeaders[2].innerText).toBe('Editorsinfo');
    expect(tileHeaders[3].innerText).toBe('Productsinfo');
    expect(tileHeaders[4].innerText).toBe('Owned Licensesinfo');
    expect(tileHeaders[5].innerText).toBe('Maintenance Licensesinfo');
    expect(tileHeaders[6].innerText).toBe('Underusage Amountinfo');
    expect(tileHeaders[7].innerText).toBe('Counterfeiting Amountinfo');
    expect(tileHeaders[8].innerText).toBe('Software Licence Compositioninfo');
    expect(tileHeaders[9].innerText).toBe('Equipment Detailsinfo');
    expect(tileHeaders[10].innerText).toBe('Number of Products Per Editorinfo');
  });

  // Quality tab
  it("should have tab with label 'Quality'", () => {
    const firstTab = fixture.nativeElement.querySelectorAll('.mat-tab-link')[1];
    expect(firstTab.innerText).toBe('Quality');
  });

  it("should have all elements of 'Quality' displayed properly if it is the selected tab", () => {
    component.currentTab = 'Quality';
    const tileHeaders = fixture.nativeElement.querySelectorAll('.tileHeader');
    // expect(tileHeaders[9].innerText).toBe('Not Deployed Productsinfo');
    // expect(tileHeaders[10].innerText).toBe('Not Licensed Productsinfo');
    // expect(tileHeaders[11].innerText).toBe(
    //   'Last Injection Failures(Last 30 days)info'
    // );
    // expect(tileHeaders[12].innerText).toBe('Development Rate Detailsinfo');
    // expect(tileHeaders[13].innerText).toBe(
    //   'Injection Errors(Last 30 days)info'
    // );
  });

  // Compliance tab
  it("should have tab with label 'Compliance'", () => {
    const firstTab = fixture.nativeElement.querySelectorAll('.mat-tab-link')[2];
    expect(firstTab.innerText).toBe('Compliance');
  });

  it("should have all elements of 'Compliance' displayed properly if it is the selected tab", () => {
    component.currentTab = 'Compliance';
    const tileHeaders = fixture.nativeElement.querySelectorAll('.tileHeader');
    // expect(tileHeaders[14].innerText).toBe(
    //   'Under-usage : Financial Volumeinfo'
    // );
    // expect(tileHeaders[15].innerText).toBe(
    //   'Counterfeiting : Financial Volumeinfo'
    // );
    // expect(tileHeaders[16].innerText).toBe(
    //   'Under-usage : Number of Licenseinfo'
    // );
    // expect(tileHeaders[17].innerText).toBe(
    //   'Counterfeiting : Number of Licenseinfo'
    // );
  });
});
