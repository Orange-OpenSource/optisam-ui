import { ControlContainer } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorSearchBarComponent } from './editor-search-bar.component';
import { TranslateModule } from '@ngx-translate/core';

describe('EditorSearchBarComponent', () => {
  let component: EditorSearchBarComponent;
  let fixture: ComponentFixture<EditorSearchBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditorSearchBarComponent],
      providers: [ControlContainer],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorSearchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
