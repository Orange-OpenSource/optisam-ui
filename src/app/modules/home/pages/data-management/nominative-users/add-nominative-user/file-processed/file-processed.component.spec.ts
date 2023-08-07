import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileProcessedComponent } from './file-processed.component';
import { TranslateModule } from '@ngx-translate/core';

describe('FileProcessedComponent', () => {
  let component: FileProcessedComponent;
  let fixture: ComponentFixture<FileProcessedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FileProcessedComponent],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileProcessedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
