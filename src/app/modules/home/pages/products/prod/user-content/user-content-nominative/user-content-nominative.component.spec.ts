import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { UserContentNominativeComponent } from './user-content-nominative.component';
import { ProductService } from '@core/services';
import { MatDialogModule } from '@angular/material/dialog';

describe('UserContentNominativeComponent', () => {
  let component: UserContentNominativeComponent;
  let fixture: ComponentFixture<UserContentNominativeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserContentNominativeComponent],
      imports: [
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        MatDialogModule,
      ],
      providers: [ProductService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserContentNominativeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
