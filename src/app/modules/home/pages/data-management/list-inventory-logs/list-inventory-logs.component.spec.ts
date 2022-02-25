import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { CustomMaterialModule } from 'src/app/material.module';

import { ListInventoryLogsComponent } from './list-inventory-logs.component';

describe('ListInventoryLogsComponent', () => {
  let component: ListInventoryLogsComponent;
  let fixture: ComponentFixture<ListInventoryLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListInventoryLogsComponent ],
      imports : [ 
                  CustomMaterialModule,
                  BrowserAnimationsModule,
                  HttpClientTestingModule,
                  TranslateModule.forRoot() 
                ],
      providers : [ 
                    { provide: MAT_DIALOG_DATA, useValue: {} },
                    { provide: MatDialogRef, useValue: {} }
                  ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListInventoryLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
