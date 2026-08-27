import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Landing } from './landing';

describe('Landing', () => {
  let fixture: ComponentFixture<Landing>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Landing],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Landing);
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
