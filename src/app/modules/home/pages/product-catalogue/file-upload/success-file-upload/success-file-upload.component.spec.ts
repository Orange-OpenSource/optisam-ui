import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { SuccessFileUploadComponent } from './success-file-upload.component';

describe('SuccessFileUploadComponent', () => {
  let component: SuccessFileUploadComponent;
  let fixture: ComponentFixture<SuccessFileUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[TranslateModule.forRoot()],
      declarations: [ SuccessFileUploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccessFileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
