import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ContactService } from '@services/contact/contact';
import { aquachainContent } from '../../content';

@Component({
  selector: 'contact',
  imports: [ReactiveFormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Contact {
  readonly content = aquachainContent;
  private readonly fb = inject(FormBuilder);
  private readonly contactService = inject(ContactService);

  readonly sending = signal(false);
  readonly status = signal<'idle' | 'success' | 'error'>('idle');
  readonly statusMessage = signal('');

  readonly honeypotField = viewChild<ElementRef<HTMLInputElement>>('honeypotField');

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(120)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(254)]],
    message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(5000)]],
  });

  async submit(): Promise<void> {
    const honeypot = this.honeypotField()?.nativeElement.value ?? '';
    if (honeypot.trim()) {
      return;
    }

    if (this.form.invalid || this.sending()) {
      this.form.markAllAsTouched();
      return;
    }

    this.sending.set(true);
    this.status.set('idle');
    this.statusMessage.set('');

    try {
      const result = await this.contactService.send(
        this.form.getRawValue(),
        this.content.contact.recipientEmail,
      );
      this.status.set('success');
      this.statusMessage.set(result.message);
      this.form.reset();
    } catch (error) {
      this.status.set('error');
      this.statusMessage.set(
        error instanceof Error
          ? error.message
          : this.content.contact.errorMessage,
      );
    } finally {
      this.sending.set(false);
    }
  }
}
