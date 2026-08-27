import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { InterinnlLanding } from './landing';

describe('InterinnlLanding', () => {
  let fixture: ComponentFixture<InterinnlLanding>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterinnlLanding],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(InterinnlLanding);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should show InterINNL mission and Grevix partner', () => {
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Mission');
    expect(text).toContain('AquaChain');
    expect(text).toContain('Grevix');
  });
});
