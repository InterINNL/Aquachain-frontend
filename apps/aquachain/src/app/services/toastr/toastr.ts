import { Injectable } from '@angular/core';
import { ExecuteResult } from '@cosmjs/cosmwasm-stargate';
import { environment } from '@env/environment';
import { ToastrService as toastr } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ToastrService {
  private explorerBaseUrl = environment.explorerBaseUrl;
  constructor(private toastr: toastr) {}

  showSuccess(transactionResult: ExecuteResult, title: string) {
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

    this.toastr.success(message, title, {
      enableHtml: true,
      timeOut: 30000,
      closeButton: true,
      positionClass: 'toast-top-right',
      toastClass: 'ngx-toastr no-scroll-toast',
    });
  }

  showError(message: string = 'Unknown error', title = 'Transaction Failed') {
    const cleanMessage = this.extractRelevantError(message);

    this.toastr.error(cleanMessage, title, {
      enableHtml: true,
      closeButton: true,
      timeOut: 30000,
      tapToDismiss: true,
      positionClass: 'toast-top-right',
      toastClass: 'ngx-toastr no-scroll-toast',
    });
  }

  extractRelevantError(message: string): string {
    // Split by newlines
    const lines = message.split('\n').map((line) => line.trim());

    // Find last line that starts with "rpc error: code"
    for (const line of lines) {
      if (line.includes('rpc error: code')) {
        return line;
      }
    }

    // Fallback: return full trimmed message if no rpc error line found
    return message.trim();
  }

  private getTxUrl(txHash: string): string {
    return `${this.explorerBaseUrl}/tx/${txHash}`;
  }
}
