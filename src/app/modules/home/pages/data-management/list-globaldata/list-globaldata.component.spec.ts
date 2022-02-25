import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListGlobaldataComponent } from './list-globaldata.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { CustomMaterialModule } from 'src/app/material.module';
import { MatDialog } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';

describe('ListGlobaldataComponent', () => {
  let component: ListGlobaldataComponent;
  let fixture: ComponentFixture<ListGlobaldataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListGlobaldataComponent ],
      imports:[
                CustomMaterialModule,
                RouterTestingModule,
                HttpClientTestingModule,
                BrowserAnimationsModule,
                TranslateModule.forRoot()
              ],
      providers:[
                  { provide: MatDialog, useValue: {} }
                ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListGlobaldataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
