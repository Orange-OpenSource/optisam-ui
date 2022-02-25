import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListScopesComponent } from './list-scopes.component';
import { TranslateModule } from '@ngx-translate/core';
import { LoadingSpinnerComponent } from 'src/app/shared/loading-spinner/loading-spinner.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CustomMaterialModule } from 'src/app/material.module';

describe('ListScopesComponent', () => {
  let component: ListScopesComponent;
  let fixture: ComponentFixture<ListScopesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ 
                      ListScopesComponent,
                      LoadingSpinnerComponent
                    ],
      imports : [ 
                  HttpClientTestingModule,
                  CustomMaterialModule,
                  TranslateModule.forRoot()
                ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListScopesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
