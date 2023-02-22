import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

import { ViewEditorDetailsAccComponent } from './view-editor-details-acc.component';

describe('ViewEditorDetailsAccComponent', () => {
  let component: ViewEditorDetailsAccComponent;
  let fixture: ComponentFixture<ViewEditorDetailsAccComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[MatDialogModule,HttpClientTestingModule,TranslateModule.forRoot()],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ],
      declarations: [ ViewEditorDetailsAccComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewEditorDetailsAccComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
