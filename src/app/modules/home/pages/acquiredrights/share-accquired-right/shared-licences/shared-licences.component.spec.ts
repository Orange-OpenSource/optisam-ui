import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlContainer, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductService } from '@core/services';
import { TranslateModule } from '@ngx-translate/core';

import { SharedLicencesComponent } from './shared-licences.component';

describe('SharedLicencesComponent', () => {
  let component: SharedLicencesComponent;
  let fixture: ComponentFixture<SharedLicencesComponent>;
  const formBuilder: FormBuilder = new FormBuilder();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedLicencesComponent ],
      imports:[ReactiveFormsModule,
        FormsModule,MatDialogModule,HttpClientTestingModule,TranslateModule.forRoot()],
      providers: [
         ControlContainer,
         { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} },
    { provide: FormBuilder,useValue:formBuilder },
    ProductService
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedLicencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
