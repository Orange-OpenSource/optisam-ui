import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IsFlagAvailablePipe } from '@core/landing-page/editors-list-thumbnail/editor-item-thumb/pipes/is-flag-available.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { CompanyIconPipe } from '@shared/common-pipes/company-icon.pipe';
import { TrimTextPipe } from '@shared/common-pipes/trim-text.pipe';
import { EditorInfoComponent } from './editor-info.component';
import { JoinVendorsPipe } from './join-vendors.pipe';

describe('EditorInfoComponent', () => {
  let component: EditorInfoComponent;
  let fixture: ComponentFixture<EditorInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        EditorInfoComponent,
        CompanyIconPipe,
        TrimTextPipe,
        IsFlagAvailablePipe,
        JoinVendorsPipe
      ],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
