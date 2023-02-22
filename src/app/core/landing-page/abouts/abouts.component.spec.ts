import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

import { AboutsComponent } from './abouts.component';

describe('AboutsComponent', () => {
  let component: AboutsComponent;
  let fixture: ComponentFixture<AboutsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[MatDialogModule,TranslateModule.forRoot()],
      declarations: [ AboutsComponent ],
      providers:[{ provide: MAT_DIALOG_DATA, useValue: {  } }]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
