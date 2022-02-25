import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListCoreFactorComponent } from './list-core-factor.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';

describe('ListCoreFactorComponent', () => {
  let component: ListCoreFactorComponent;
  let fixture: ComponentFixture<ListCoreFactorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListCoreFactorComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot(),
      ],
      providers: [{ provide: MatDialog, useValue: {} }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCoreFactorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
