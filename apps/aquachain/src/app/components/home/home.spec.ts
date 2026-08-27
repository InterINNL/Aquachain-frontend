import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import {
  FaIconLibrary,
  FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { Home } from './home';

describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home, FontAwesomeModule],
      providers: [provideRouter([]), FaIconLibrary],
    }).compileComponents();

    TestBed.inject(FaIconLibrary).addIconPacks(fas);

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show hero title', () => {
    expect(fixture.nativeElement.textContent).toContain(
      'Water decisions backed by verifiable data',
    );
  });
});
