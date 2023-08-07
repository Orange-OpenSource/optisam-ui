import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorItemThumbComponent } from './editor-item-thumb.component';
import { TranslateModule } from '@ngx-translate/core';
import { TrimTextPipe } from '@shared/common-pipes/trim-text.pipe';
import { CompanyIconPipe } from '@shared/common-pipes/company-icon.pipe';
import { IsFlagAvailablePipe } from './pipes/is-flag-available.pipe';
import { TakeFirstPipe } from '@shared/common-pipes/take-first.pipe';
import { RestScopeCountPipe } from '@shared/common-pipes/rest-scope-count.pipe';
import { TrimTextRangePipe } from './pipes/trim-text-range.pipe';

describe('EditorItemThumbComponent', () => {
  let component: EditorItemThumbComponent;
  let fixture: ComponentFixture<EditorItemThumbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        EditorItemThumbComponent,
        TrimTextPipe,
        CompanyIconPipe,
        IsFlagAvailablePipe,
        TakeFirstPipe,
        RestScopeCountPipe,
        TrimTextRangePipe,
      ],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorItemThumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
