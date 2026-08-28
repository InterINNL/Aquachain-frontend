import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import {
  FaIconLibrary,
  FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { vi } from 'vitest';
import { AgentGatewayService } from '@services/agent-gateway/agent-gateway';
import { FieldAgentsService } from '@services/field-agents/field-agents';

vi.mock('@services/wallet/wallet', () => ({
  WalletService: class {
    connectWallet = vi.fn();
  },
}));

vi.mock('@services/contract/contract', () => ({
  ContractService: class {
    simulateAndExecute = vi.fn();
    getqueryClient = vi.fn();
  },
  pageSize: 10,
}));

vi.mock('@cosmjs/cosmwasm-stargate', () => ({
  SigningCosmWasmClient: {
    connect: vi.fn(),
    connectWithSigner: vi.fn(),
  },
  CosmWasmClient: {
    connect: vi.fn(),
  },
}));

import { AgentOps } from './agent-ops';

describe('AgentOps', () => {
  let component: AgentOps;
  let fixture: ComponentFixture<AgentOps>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentOps, FontAwesomeModule],
      providers: [
        provideRouter([]),
        FaIconLibrary,
        {
          provide: AgentGatewayService,
          useValue: {
            fetchCapabilities: vi.fn().mockResolvedValue({}),
            fetchHealth: vi.fn().mockResolvedValue({ status: 'ok' }),
          },
        },
        {
          provide: FieldAgentsService,
          useValue: {
            listAgents: vi.fn().mockResolvedValue([]),
          },
        },
      ],
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
    expect(fixture.nativeElement.textContent).toContain('Agent Ops');
  });
});
