import {
  ChangeDetectionStrategy,
  Component,
  inject,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  AgentGatewayService,
  GatewayCapabilities,
  GatewayHealth,
} from '@services/agent-gateway/agent-gateway';
import { environment } from '@env/environment';
import { aquachainContent } from '../../content';
import { ModuleShell } from '../module-shell/module-shell';

@Component({
  selector: 'agent-ops',
  imports: [FontAwesomeModule, RouterModule, ModuleShell],
  templateUrl: './agent-ops.html',
  styleUrl: './agent-ops.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgentOps {
  readonly content = aquachainContent;
  readonly payRouterDiagramSrc = 'photos/agent-x402-pay-router.svg';
  readonly gatewayConfigured = Boolean(environment.agentGatewayUrl);
  private readonly gateway = inject(AgentGatewayService);
  private readonly platformId = inject(PLATFORM_ID);

  readonly loading = signal(false);
  readonly gatewayError = signal('');
  readonly capabilities = signal<GatewayCapabilities | null>(null);
  readonly health = signal<GatewayHealth | null>(null);

  constructor() {
    if (isPlatformBrowser(this.platformId) && this.gatewayConfigured) {
      void this.loadGateway();
    }
  }

  formatPhase(phase: string): string {
    return phase.toUpperCase();
  }

  sampleJson(): string {
    return JSON.stringify(this.content.agentOps.samplePayload, null, 2);
  }

  curlExample(): string {
    const base = environment.agentGatewayUrl.replace(/\/$/, '');
    return [
      `curl -sS -X POST ${base}/v1/measurements \\`,
      `  -H 'Content-Type: application/json' \\`,
      `  -d '${JSON.stringify(this.content.agentOps.samplePayload)}'`,
    ].join('\n');
  }

  async loadGateway(): Promise<void> {
    this.loading.set(true);
    this.gatewayError.set('');
    try {
      const [caps, health] = await Promise.all([
        this.gateway.fetchCapabilities(),
        this.gateway.fetchHealth(),
      ]);
      this.capabilities.set(caps);
      this.health.set(health);
    } catch (error) {
      this.gatewayError.set(
        error instanceof Error ? error.message : 'Gateway unreachable',
      );
    } finally {
      this.loading.set(false);
    }
  }
}
