import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ApplicationService } from 'src/app/core/services/application.service';
import { CustomMaterialModule } from 'src/app/material.module';
import { SharedModule } from 'src/app/shared/shared.module';

import { DefineObsolescenceScaleComponent } from './define-obsolescence-scale.component';

describe('DefineObsolescenceScaleComponent', () => {
  let component: DefineObsolescenceScaleComponent;
  let fixture: ComponentFixture<DefineObsolescenceScaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DefineObsolescenceScaleComponent ],
      imports: [
        RouterTestingModule, 
        HttpClientTestingModule,
        CustomMaterialModule,
        SharedModule,
        TranslateModule.forRoot()
      ],
      providers: [ApplicationService]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DefineObsolescenceScaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
