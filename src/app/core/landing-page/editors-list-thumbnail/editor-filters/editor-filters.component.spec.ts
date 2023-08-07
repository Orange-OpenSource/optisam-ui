import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorFiltersComponent } from './editor-filters.component';
import { ControlContainer } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

describe('EditorFiltersComponent', () => {
  let component: EditorFiltersComponent;
  let fixture: ComponentFixture<EditorFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditorFiltersComponent],
      providers: [ControlContainer],
      imports: [
        HttpClientTestingModule,
        MatDialogModule,
        TranslateModule.forRoot(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
