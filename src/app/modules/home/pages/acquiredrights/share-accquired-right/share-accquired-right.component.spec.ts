import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlContainer, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { ProductService } from '@core/services';
import { TranslateModule } from '@ngx-translate/core';

import { ShareAccquiredRightComponent } from './share-accquired-right.component';

describe('ShareAccquiredRightComponent', () => {
  let component: ShareAccquiredRightComponent;
  let fixture: ComponentFixture<ShareAccquiredRightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[ReactiveFormsModule,
        FormsModule,MatDialogModule,HttpClientTestingModule,TranslateModule.forRoot(),RouterTestingModule],
      declarations: [ ShareAccquiredRightComponent ],
      providers: [
         ControlContainer,
         { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} },
    ProductService
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareAccquiredRightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
