import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { ProductService } from '@core/services/product.service';

import { IndividualNominativeUserComponent } from './individual-nominative-user.component';
import { TranslateModule } from '@ngx-translate/core';

describe('IndividualNominativeUserComponent', () => {
  let component: IndividualNominativeUserComponent;
  let fixture: ComponentFixture<IndividualNominativeUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatDialogModule,
        TranslateModule.forRoot(),
      ],
      declarations: [IndividualNominativeUserComponent],
      providers: [ProductService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualNominativeUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
