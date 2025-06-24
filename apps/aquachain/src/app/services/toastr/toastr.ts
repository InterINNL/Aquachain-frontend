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
      tapToDismiss: true,
      positionClass: 'toast-top-right',
    });
  }

  showError(message: string = 'Unknown error', title = 'Transaction Failed') {
    this.toastr.error(message, title, {
      closeButton: true,
      timeOut: 30000,
      positionClass: 'toast-top-right',
    });
  }

  private getTxUrl(txHash: string): string {
    return `${this.explorerBaseUrl}/tx/${txHash}`;
  }
}
