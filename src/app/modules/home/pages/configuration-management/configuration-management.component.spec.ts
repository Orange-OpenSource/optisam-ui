import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationManagementComponent } from './configuration-management.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('ConfigurationManagementComponent', () => {
  let component: ConfigurationManagementComponent;
  let fixture: ComponentFixture<ConfigurationManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigurationManagementComponent ],
      imports : [ RouterTestingModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
