import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ContactService } from '@services/contact/contact';
import { Contact } from './contact';

describe('Contact', () => {
  let component: Contact;
  let fixture: ComponentFixture<Contact>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Contact],
      providers: [
        provideRouter([]),
        {
          provide: ContactService,
          useValue: {
            send: vi.fn().mockResolvedValue({ ok: true, message: 'Message sent.' }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Contact);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show contact title', () => {
    expect(fixture.nativeElement.textContent).toContain('Contact AquaChain');
  });
});
