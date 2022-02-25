import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AqRightsComponent } from './aq-rights.component';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'src/app/shared/shared.module';

describe('AqRightsComponent', () => {
  let component: AqRightsComponent;
  let fixture: ComponentFixture<AqRightsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AqRightsComponent ],
      imports : [
                  SharedModule,
                  TranslateModule.forRoot() 
                ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AqRightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
