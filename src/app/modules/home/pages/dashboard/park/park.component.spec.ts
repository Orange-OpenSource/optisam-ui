import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkComponent } from './park.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ProductService } from '@core/services';
import { TranslateModule } from '@ngx-translate/core';

describe('ParkComponent', () => {
  let component: ParkComponent;
  let fixture: ComponentFixture<ParkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ParkComponent],
      imports: [HttpClientTestingModule, MatDialogModule, TranslateModule.forRoot()],
      providers: [ProductService]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
