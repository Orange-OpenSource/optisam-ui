import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorDetailsComponent } from './editor-details.component';
import { TranslateModule } from '@ngx-translate/core';

describe('EditorDetailsComponent', () => {
  let component: EditorDetailsComponent;
  let fixture: ComponentFixture<EditorDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditorDetailsComponent],
      imports: [
        HttpClientTestingModule,
        HttpClientModule,
        TranslateModule.forRoot(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
