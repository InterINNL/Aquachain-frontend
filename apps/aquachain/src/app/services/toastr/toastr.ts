import { DOCUMENT, Injectable, inject } from '@angular/core';
import { ExecuteResult } from '@cosmjs/cosmwasm-stargate';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class ToastrService {
  private readonly explorerBaseUrl = environment.explorerBaseUrl;
  private readonly document = inject(DOCUMENT);

  showSuccess(transactionResult: ExecuteResult, title: string): void {
    const explorerUrl = this.getTxUrl(transactionResult.transactionHash);
    const message = `
    <div>
      <strong>Transaction Hash:</strong>
      <a href="${explorerUrl}" target="_blank" rel="noopener noreferrer">
        ${transactionResult.transactionHash}
      </a><br />
      <small>Height: ${transactionResult.height}</small><br />
      <small>Gas Used: ${transactionResult.gasUsed}</small>
    </div>
  `;
    this.showToast(title, message, 'success');
  }

  showError(message = 'Unknown error', title = 'Transaction Failed'): void {
    const cleanMessage = this.extractRelevantError(message);
    this.showToast(title, cleanMessage, 'error');
  }

  extractRelevantError(message: string): string {
    const lines = message.split('\n').map((line) => line.trim());
    for (const line of lines) {
      if (line.includes('rpc error: code')) {
        return line;
      }
    }
    return message.trim();
  }

  private getTxUrl(txHash: string): string {
    return `${this.explorerBaseUrl}/tx/${txHash}`;
  }

  private showToast(
    title: string,
    bodyHtml: string,
    kind: 'success' | 'error',
  ): void {
    const host = this.document.body;
    if (!host) {
      return;
    }

    let container = this.document.getElementById('aquachain-toast-root');
    if (!container) {
      container = this.document.createElement('div');
      container.id = 'aquachain-toast-root';
      container.className = 'aquachain-toast-root';
      host.appendChild(container);
    }

    const toast = this.document.createElement('div');
    toast.className = `aquachain-toast aquachain-toast--${kind}`;
    toast.innerHTML = `
      <div class="aquachain-toast__header">
        <strong>${title}</strong>
        <button type="button" class="aquachain-toast__close" aria-label="Close">×</button>
      </div>
      <div class="aquachain-toast__body">${bodyHtml}</div>
    `;

    const remove = (): void => {
      toast.remove();
    };
    toast
      .querySelector('.aquachain-toast__close')
      ?.addEventListener('click', remove);
    container.appendChild(toast);
    window.setTimeout(remove, 30_000);
  }
}
