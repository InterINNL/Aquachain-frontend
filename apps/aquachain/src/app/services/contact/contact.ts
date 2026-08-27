import { Injectable } from '@angular/core';

export interface ContactPayload {
  name: string;
  email: string;
  message: string;
}

export interface ContactResult {
  ok: boolean;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ContactService {
  async send(payload: ContactPayload, recipientEmail: string): Promise<ContactResult> {
    const endpoint = `https://formsubmit.co/ajax/${encodeURIComponent(recipientEmail)}`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        name: payload.name,
        email: payload.email,
        message: payload.message,
        _subject: 'AquaChain contact form',
        _template: 'table',
        _captcha: 'false',
      }),
    });

    const data = (await response.json().catch(() => ({}))) as {
      success?: string;
      message?: string;
    };

    if (!response.ok) {
      throw new Error(data.message ?? 'Could not send your message.');
    }

    return {
      ok: true,
      message: data.success ?? data.message ?? 'Message sent.',
    };
  }
}
