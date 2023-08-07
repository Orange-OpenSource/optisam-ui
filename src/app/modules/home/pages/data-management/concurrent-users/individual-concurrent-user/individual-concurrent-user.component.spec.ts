import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { ProductService } from '@core/services';

import { IndividualConcurrentUserComponent } from './individual-concurrent-user.component';
import { TranslateModule } from '@ngx-translate/core';

describe('IndividualConcurrentUserComponent', () => {
  let component: IndividualConcurrentUserComponent;
  let fixture: ComponentFixture<IndividualConcurrentUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatDialogModule,
        TranslateModule.forRoot(),
      ],
      declarations: [IndividualConcurrentUserComponent],
      providers: [ProductService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualConcurrentUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
