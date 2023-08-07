import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderInfoComponent } from './header-info.component';
import { TranslateModule } from '@ngx-translate/core';

describe('HeaderInfoComponent', () => {
  let component: HeaderInfoComponent;
  let fixture: ComponentFixture<HeaderInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderInfoComponent],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
