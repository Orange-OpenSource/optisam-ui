import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorInfoV2Component } from './editor-info-v2.component';

describe('EditorInfoV2Component', () => {
  let component: EditorInfoV2Component;
  let fixture: ComponentFixture<EditorInfoV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditorInfoV2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorInfoV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
