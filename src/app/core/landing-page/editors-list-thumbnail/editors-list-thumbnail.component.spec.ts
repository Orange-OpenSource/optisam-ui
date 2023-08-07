import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorsListThumbnailComponent } from './editors-list-thumbnail.component';
import { FormBuilder } from '@angular/forms';

describe('EditorsListThumbnailComponent', () => {
  let component: EditorsListThumbnailComponent;
  let fixture: ComponentFixture<EditorsListThumbnailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditorsListThumbnailComponent],
      imports: [HttpClientTestingModule],
      providers: [FormBuilder],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorsListThumbnailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
