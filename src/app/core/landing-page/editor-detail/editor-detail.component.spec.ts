import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorDetailComponent } from './editor-detail.component';
import { TranslateModule } from '@ngx-translate/core';

describe('EditorDetailComponent', () => {
  let component: EditorDetailComponent;
  let fixture: ComponentFixture<EditorDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditorDetailComponent],
      imports: [TranslateModule.forRoot(), HttpClientTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
