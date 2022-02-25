import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { CustomMaterialModule } from 'src/app/material.module';

import { FailedRecordsDetailsComponent } from './failed-records-details.component';

describe('FailedRecordsDetailsComponent', () => {
  let component: FailedRecordsDetailsComponent;
  let fixture: ComponentFixture<FailedRecordsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FailedRecordsDetailsComponent ],
      imports : [ 
                  CustomMaterialModule,
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
    fixture = TestBed.createComponent(FailedRecordsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
