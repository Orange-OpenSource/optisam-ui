import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiBlockComponent } from './kpi-block.component';
import { TranslateModule } from '@ngx-translate/core';
import { CheckForMillionPipe } from '@shared/common-pipes/check-for-million.pipe';
import { FrenchNumberPipe } from '@shared/common-pipes/french-number.pipe';

describe('KpiBlockComponent', () => {
  let component: KpiBlockComponent;
  let fixture: ComponentFixture<KpiBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KpiBlockComponent, CheckForMillionPipe, FrenchNumberPipe],
      imports: [TranslateModule.forRoot()]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KpiBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
