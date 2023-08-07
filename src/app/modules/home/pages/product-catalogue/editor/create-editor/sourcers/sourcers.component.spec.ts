import { TranslateModule } from '@ngx-translate/core';
import { ControlContainer } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SourcersComponent } from './sourcers.component';

describe('SourcersComponent', () => {
  let component: SourcersComponent;
  let fixture: ComponentFixture<SourcersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SourcersComponent],
      providers: [ControlContainer],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SourcersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
