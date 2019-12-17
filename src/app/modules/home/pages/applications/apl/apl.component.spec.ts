import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AplComponent } from './apl.component';


describe('ApplicationComponent', () => {
  let component: AplComponent;
  let fixture: ComponentFixture<AplComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AplComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AplComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
