import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import {
  FaIconLibrary,
  FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { AgentOps } from './agent-ops';

describe('AgentOps', () => {
  let component: AgentOps;
  let fixture: ComponentFixture<AgentOps>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentOps, FontAwesomeModule],
      providers: [provideRouter([]), FaIconLibrary],
    }).compileComponents();

    TestBed.inject(FaIconLibrary).addIconPacks(fas);

    fixture = TestBed.createComponent(AgentOps);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show agent ops title', () => {
    expect(fixture.nativeElement.textContent).toContain('Agent field ops');
  });
});
