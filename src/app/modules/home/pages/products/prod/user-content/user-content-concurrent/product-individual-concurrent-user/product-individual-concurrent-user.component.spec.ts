import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductIndividualConcurrentUserComponent } from './product-individual-concurrent-user.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProductService } from '@core/services';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '@shared/shared.module';

describe('ProductIndividualConcurrentUserComponent', () => {
  let component: ProductIndividualConcurrentUserComponent;
  let fixture: ComponentFixture<ProductIndividualConcurrentUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductIndividualConcurrentUserComponent],
      imports: [
        HttpClientTestingModule,
        SharedModule,
        TranslateModule.forRoot(),
        BrowserAnimationsModule,
      ],
      providers: [ProductService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductIndividualConcurrentUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
