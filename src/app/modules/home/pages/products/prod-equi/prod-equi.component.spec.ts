import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdEquiComponent } from './prod-equi.component';

describe('ProdEquiComponent', () => {
  let component: ProdEquiComponent;
  let fixture: ComponentFixture<ProdEquiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProdEquiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProdEquiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
