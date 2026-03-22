import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PortalStateService } from '../core/services/portal-state.service';

@Component({
  selector: 'app-request-book-page',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="section glass-panel">
      <div class="split-grid">
        <article class="shelf-card">
          <p class="eyebrow">Recommendation desk</p>
          <h2 class="section-title">Request a missing book or ask for a recommendation</h2>
          <p class="copy">
            Readers can ask for exact titles, topic-based suggestions, or author recommendations. This adds a more
            community-driven feature to the portal instead of just a static catalog.
          </p>
          <div class="chip-row">
            <span class="pill">Exact title requests</span>
            <span class="pill">Genre suggestions</span>
            <span class="pill">Author discovery</span>
            <span class="pill">Study-focused books</span>
          </div>
        </article>

        <form class="form-card list-stack" [formGroup]="form" (ngSubmit)="submit()">
          <label>
            <span class="eyebrow">Your name</span>
            <input class="field" type="text" formControlName="name" />
          </label>
          <label>
            <span class="eyebrow">Email</span>
            <input class="field" type="email" formControlName="email" />
          </label>
          <label>
            <span class="eyebrow">Book title or topic</span>
            <input class="field" type="text" formControlName="requestedTitle" />
          </label>
          <label>
            <span class="eyebrow">Why do you want it?</span>
            <textarea class="textarea" rows="5" formControlName="message"></textarea>
          </label>
          <button class="btn primary" type="submit">Send request</button>
          @if (feedback()) {
            <p class="success-text">{{ feedback() }}</p>
          }
        </form>
      </div>
    </section>

    <section class="section glass-panel">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Recent requests</p>
          <h2 class="section-title">Community request board</h2>
        </div>
      </div>

      @if (portal.requests().length) {
        <div class="list-stack">
          @for (request of portal.requests(); track request.createdAt + request.email) {
            <article class="list-item">
              <strong>{{ request.requestedTitle }}</strong>
              <p class="muted">{{ request.name }} · {{ request.email }} · {{ request.createdAt }}</p>
              <p class="copy">{{ request.message }}</p>
            </article>
          }
        </div>
      } @else {
        <p class="empty-state">No requests yet. Submit the first recommendation request from the form above.</p>
      }
    </section>
  `,
})
export class RequestBookPageComponent {
  private readonly builder = inject(FormBuilder);
  readonly portal = inject(PortalStateService);
  readonly feedback = signal('');

  readonly form = this.builder.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    requestedTitle: ['', Validators.required],
    message: ['', Validators.required],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.feedback.set('');
      return;
    }

    const value = this.form.getRawValue();
    this.portal.addRequest({
      name: value.name ?? '',
      email: value.email ?? '',
      requestedTitle: value.requestedTitle ?? '',
      message: value.message ?? '',
    });
    this.form.reset();
    this.feedback.set('Your request has been added to the portal request board.');
  }
}
