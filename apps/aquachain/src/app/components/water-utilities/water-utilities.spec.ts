import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WaterUtilities } from './water-utilities';

describe('WaterUtilities', () => {
  let component: WaterUtilities;
  let fixture: ComponentFixture<WaterUtilities>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WaterUtilities],
    }).compileComponents();

    fixture = TestBed.createComponent(WaterUtilities);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
