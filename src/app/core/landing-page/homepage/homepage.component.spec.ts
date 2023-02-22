import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MatMenuModule } from '@angular/material/menu';
import { HomepageComponent } from './homepage.component';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';

describe('HomepageComponent', () => {
  let component: HomepageComponent;
  let fixture: ComponentFixture<HomepageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomepageComponent ],
      imports: [TranslateModule.forRoot(),
        MatMenuModule,
        MatDialogModule,RouterTestingModule]
    })
    .compileComponents();
  });

  // beforeEach(() => {
  //   fixture = TestBed.createComponent(HomepageComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();
  // });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
