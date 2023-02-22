import { ControlContainer } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseSourceListComponent } from './close-source-list.component';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

describe('CloseSourceListComponent', () => {
  let component: CloseSourceListComponent;
  let fixture: ComponentFixture<CloseSourceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CloseSourceListComponent],
      imports: [MatDialogModule, TranslateModule.forRoot()],
      providers: [ControlContainer],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CloseSourceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
