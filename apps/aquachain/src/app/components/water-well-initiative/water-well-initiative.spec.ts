import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WaterWellInitiative } from './water-well-initiative';

describe('WaterWellInitiative', () => {
  let component: WaterWellInitiative;
  let fixture: ComponentFixture<WaterWellInitiative>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WaterWellInitiative],
    }).compileComponents();

    fixture = TestBed.createComponent(WaterWellInitiative);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
