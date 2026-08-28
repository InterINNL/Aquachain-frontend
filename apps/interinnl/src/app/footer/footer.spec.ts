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

  it('keeps Connect text links and adds icons below them', () => {
    const root = fixture.nativeElement as HTMLElement;
    const connect = root.querySelector('.innl-footer__connect');
    expect(connect).toBeTruthy();

    const text = connect?.textContent ?? '';
    expect(text).toContain('GitHub');
    expect(text).toContain('LinkedIn group');
    expect(text).toContain(interinnlContent.links.contactEmail);

    const social = connect?.querySelector('.innl-footer__social');
    expect(social).toBeTruthy();

    const icons = social?.querySelectorAll(
      'a.innl-footer__social-link',
    ) as NodeListOf<HTMLAnchorElement>;
    expect(icons.length).toBe(2);
    expect(icons[0].href).toBe(interinnlContent.links.githubOrg);
    expect(icons[0].getAttribute('aria-label')).toBe('InterINNL on GitHub');
    expect(icons[1].href).toBe(interinnlContent.links.linkedinGroup);
    expect(icons[1].getAttribute('aria-label')).toBe('InterINNL on LinkedIn');

    const soon = connect?.querySelector('.innl-footer__soon');
    expect(soon).toBeTruthy();
    expect(social).toBeTruthy();
    if (!soon || !social) {
      return;
    }
    expect(
      soon.compareDocumentPosition(social) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });
});
