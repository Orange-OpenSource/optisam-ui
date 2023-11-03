import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { ProductService } from '@core/services';
import { TranslateModule } from '@ngx-translate/core';
import { SoftwareExpenditureComponent } from './software-expenditure.component';
import { FrenchNumberPipe } from '@shared/common-pipes/french-number.pipe';

describe('SoftwareExpenditureComponent', () => {
  let component: SoftwareExpenditureComponent;
  let fixture: ComponentFixture<SoftwareExpenditureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatDialogModule,
        TranslateModule.forRoot(),
      ],
      declarations: [SoftwareExpenditureComponent, FrenchNumberPipe],
      providers: [ProductService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SoftwareExpenditureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
