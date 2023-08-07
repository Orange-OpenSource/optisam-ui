import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteGlobalAccountManagerComponent } from './delete-global-account-manager.component';
import { TranslateModule } from '@ngx-translate/core';

describe('DeleteGlobalAccountManagerComponent', () => {
  let component: DeleteGlobalAccountManagerComponent;
  let fixture: ComponentFixture<DeleteGlobalAccountManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteGlobalAccountManagerComponent],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteGlobalAccountManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
