import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileTypeErrorComponent } from './file-type-error.component';

describe('FileTypeErrorComponent', () => {
  let component: FileTypeErrorComponent;
  let fixture: ComponentFixture<FileTypeErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileTypeErrorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileTypeErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
