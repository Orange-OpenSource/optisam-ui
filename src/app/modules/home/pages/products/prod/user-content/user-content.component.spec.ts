import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { UserContentComponent } from './user-content.component';

describe('UserContentComponent', () => {
  let component: UserContentComponent;
  let fixture: ComponentFixture<UserContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserContentComponent ],
      imports:[TranslateModule.forRoot()]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
