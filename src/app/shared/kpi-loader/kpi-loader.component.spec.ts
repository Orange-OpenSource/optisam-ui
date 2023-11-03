import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiLoaderComponent } from './kpi-loader.component';
import { TranslateModule } from '@ngx-translate/core';

describe('KpiLoaderComponent', () => {
  let component: KpiLoaderComponent;
  let fixture: ComponentFixture<KpiLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KpiLoaderComponent ],
      imports: [ TranslateModule.forRoot()]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KpiLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
