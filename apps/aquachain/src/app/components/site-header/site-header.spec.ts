import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router, Routes } from '@angular/router';
import {
  FaIconLibrary,
  FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { SiteHeader } from './site-header';

const headerRoutes: Routes = [
  { path: 'citizen-science', component: SiteHeader },
  { path: '**', component: SiteHeader },
];

describe('SiteHeader', () => {
  let fixture: ComponentFixture<SiteHeader>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SiteHeader, FontAwesomeModule],
      providers: [provideRouter(headerRoutes), FaIconLibrary],
    }).compileComponents();

    TestBed.inject(FaIconLibrary).addIconPacks(fas);
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(SiteHeader);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should show AquaChain brand', () => {
    expect(fixture.nativeElement.textContent).toContain('AquaChain');
  });

  it('should show module name on citizen science route', async () => {
    await router.navigateByUrl('/citizen-science');
    await fixture.whenStable();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Citizen Science');
  });
});
