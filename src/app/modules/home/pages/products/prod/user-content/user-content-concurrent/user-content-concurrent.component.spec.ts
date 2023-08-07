import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { UserContentConcurrentComponent } from './user-content-concurrent.component';
import { ProductService } from '@core/services';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from '@shared/shared.module';

describe('UserContentConcurrentComponent', () => {
  let component: UserContentConcurrentComponent;
  let fixture: ComponentFixture<UserContentConcurrentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserContentConcurrentComponent],
      imports: [
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        SharedModule,
        BrowserAnimationsModule,
      ],
      providers: [ProductService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserContentConcurrentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
