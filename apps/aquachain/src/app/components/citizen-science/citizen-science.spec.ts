import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CitizenScience } from './citizen-science';

describe('CitizenScience', () => {
  let component: CitizenScience;
  let fixture: ComponentFixture<CitizenScience>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CitizenScience],
    }).compileComponents();

    fixture = TestBed.createComponent(CitizenScience);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
