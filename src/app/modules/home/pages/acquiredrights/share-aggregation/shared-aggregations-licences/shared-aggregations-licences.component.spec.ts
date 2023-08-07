import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlContainer, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductService } from '@core/services';
import { TranslateModule } from '@ngx-translate/core';

import { SharedAggregationsLicencesComponent } from './shared-aggregations-licences.component';

describe('SharedAggregationsLicencesComponent', () => {
  let component: SharedAggregationsLicencesComponent;
  let fixture: ComponentFixture<SharedAggregationsLicencesComponent>;
  const formBuilder: FormBuilder = new FormBuilder();
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedAggregationsLicencesComponent ],
      imports:[ReactiveFormsModule,
        FormsModule,MatDialogModule,HttpClientTestingModule,TranslateModule.forRoot()],
      providers:[ControlContainer,
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },ProductService,{ provide: FormBuilder, useValue: formBuilder }]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedAggregationsLicencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
