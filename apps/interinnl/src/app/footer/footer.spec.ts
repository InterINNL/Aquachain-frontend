import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Footer } from './footer';
import { interinnlContent } from '../content';

describe('Footer', () => {
  let fixture: ComponentFixture<Footer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Footer],
    }).compileComponents();

    fixture = TestBed.createComponent(Footer);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should show social icons under Connect with correct links', () => {
    const root = fixture.nativeElement as HTMLElement;
    const connect = root.querySelector('.innl-footer__connect');
    expect(connect).toBeTruthy();

    const social = connect?.querySelector('.innl-footer__social');
    expect(social).toBeTruthy();

    const github = social?.querySelector(
      'a.innl-footer__social-link--github',
    ) as HTMLAnchorElement | null;
    expect(github?.href).toBe(interinnlContent.links.githubOrg);
    expect(github?.getAttribute('aria-label')).toBe('InterINNL on GitHub');

    const linkedin = social?.querySelector(
      'a.innl-footer__social-link--linkedin',
    ) as HTMLAnchorElement | null;
    expect(linkedin?.href).toBe(interinnlContent.links.linkedinGroup);
    expect(linkedin?.getAttribute('aria-label')).toBe('InterINNL on LinkedIn');
  });
});
