import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorsListComponent } from './editors-list.component';

describe('EditorsListComponent', () => {
  let component: EditorsListComponent;
  let fixture: ComponentFixture<EditorsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditorsListComponent ],
      imports:[HttpClientTestingModule,HttpClientModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
