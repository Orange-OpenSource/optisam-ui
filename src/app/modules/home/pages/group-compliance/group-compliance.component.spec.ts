import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountService, ProductService } from '@core/services';
import { TranslateModule } from '@ngx-translate/core';
import { GroupComplianceComponent } from './group-compliance.component';
import { MatDialogModule } from '@angular/material/dialog';

describe('GroupComplianceComponent', () => {
  let component: GroupComplianceComponent;
  let fixture: ComponentFixture<GroupComplianceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TranslateModule.forRoot(), MatDialogModule],
      declarations: [GroupComplianceComponent],
      providers: [ProductService, AccountService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupComplianceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
