import { TranslateModule } from '@ngx-translate/core';
import { ControlContainer } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalAccountManagersComponent } from './global-account-managers.component';

describe('GlobalAccountManagersComponent', () => {
  let component: GlobalAccountManagersComponent;
  let fixture: ComponentFixture<GlobalAccountManagersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GlobalAccountManagersComponent],
      providers: [ControlContainer],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalAccountManagersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
