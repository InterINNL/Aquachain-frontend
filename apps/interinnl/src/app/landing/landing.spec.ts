import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Landing } from './landing';

describe('Landing', () => {
  let fixture: ComponentFixture<Landing>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Landing],
    }).compileComponents();

    fixture = TestBed.createComponent(Landing);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should show InterINNL mission, people and AquaChain', () => {
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Mission');
    expect(text).toContain('People of InterINNL');
    expect(text).toContain('AquaChain');
    expect(text).toContain('AI');
    expect(text).toContain('LLMs');
    expect(text).toContain('Blockchain');
    expect(text).toContain('Gregory Roussac');
    expect(text).toContain('Reham Abdul Rauf');
  });
});
