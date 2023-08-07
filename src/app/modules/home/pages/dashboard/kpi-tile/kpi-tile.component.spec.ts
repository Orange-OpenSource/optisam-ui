import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiTileComponent } from './kpi-tile.component';

describe('KpiTileComponent', () => {
  let component: KpiTileComponent;
  let fixture: ComponentFixture<KpiTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KpiTileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KpiTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
