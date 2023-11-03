import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvalidLinkComponent } from './invalid-link.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { CustomMaterialModule } from 'src/app/material.module';

describe('InvalidLinkComponent', () => {
  let component: InvalidLinkComponent;
  let fixture: ComponentFixture<InvalidLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InvalidLinkComponent],
      imports: [RouterTestingModule, HttpClientTestingModule, TranslateModule.forRoot(), MatDialogModule, CustomMaterialModule],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvalidLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
