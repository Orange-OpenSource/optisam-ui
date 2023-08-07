import { MatDialogModule } from '@angular/material/dialog';
import { ControlContainer } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { SingleSourcerComponent } from './single-sourcer.component';

describe('SingleSourcerComponent', () => {
  let component: SingleSourcerComponent;
  let fixture: ComponentFixture<SingleSourcerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SingleSourcerComponent],
      providers: [ControlContainer],
      imports: [MatDialogModule, TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleSourcerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
