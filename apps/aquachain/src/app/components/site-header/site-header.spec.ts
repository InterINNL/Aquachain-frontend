import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import {
  FaIconLibrary,
  FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { SiteHeader } from './site-header';

describe('SiteHeader', () => {
  let fixture: ComponentFixture<SiteHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SiteHeader, FontAwesomeModule],
      providers: [provideRouter([]), FaIconLibrary],
    }).compileComponents();

    TestBed.inject(FaIconLibrary).addIconPacks(fas);
    fixture = TestBed.createComponent(SiteHeader);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should show AquaChain brand', () => {
    expect(fixture.nativeElement.textContent).toContain('AquaChain');
  });
});
