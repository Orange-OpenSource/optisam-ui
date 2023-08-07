import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { ProductService } from '@core/services';
import { TranslateModule } from '@ngx-translate/core';

import { ConcurrentUsersComponent } from './concurrent-users.component';

describe('ConcurrentUsersComponent', () => {
  let component: ConcurrentUsersComponent;
  let fixture: ComponentFixture<ConcurrentUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConcurrentUsersComponent],
      providers: [ProductService],
      imports: [
        HttpClientTestingModule,
        MatDialogModule,
        TranslateModule.forRoot(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConcurrentUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
