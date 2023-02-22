import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

import { ViewEditorDetailsEquipComponent } from './view-editor-details-equip.component';

describe('ViewEditorDetailsEquipComponent', () => {
  let component: ViewEditorDetailsEquipComponent;
  let fixture: ComponentFixture<ViewEditorDetailsEquipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[MatDialogModule,HttpClientTestingModule,TranslateModule.forRoot()],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ],
      declarations: [ ViewEditorDetailsEquipComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewEditorDetailsEquipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
