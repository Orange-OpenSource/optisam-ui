import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiPieBlockComponent } from './kpi-pie-block.component';
import { TranslateModule } from '@ngx-translate/core';

describe('KpiPieBlockComponent', () => {
  let component: KpiPieBlockComponent;
  let fixture: ComponentFixture<KpiPieBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KpiPieBlockComponent],
      imports: [TranslateModule.forRoot()]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KpiPieBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
