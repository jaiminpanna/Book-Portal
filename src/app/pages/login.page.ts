import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-login-page',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <section class="section glass-panel">
      <div class="split-grid">
        <article class="shelf-card">
          <p class="eyebrow">Reader access</p>
          <h2 class="section-title">Login to unlock wishlist and Amazon buying</h2>
          <p class="copy">
            Authentication is still frontend demo logic for now, but the Angular flow is ready for a future backend.
            Protected routes already send readers here when wishlist pages need sign-in.
          </p>

          <div class="list-stack">
            <div class="list-item">
              <strong>Protected wishlist route</strong>
              <p class="muted">Wishlist navigation now uses Angular route guarding.</p>
            </div>
            <div class="list-item">
              <strong>Buy action protection</strong>
              <p class="muted">Readers must authenticate before Amazon purchase buttons open.</p>
            </div>
          </div>
        </article>

        <form class="form-card list-stack" [formGroup]="form" (ngSubmit)="submit()">
          <label>
            <span class="eyebrow">Full name</span>
            <input class="field" type="text" formControlName="name" />
          </label>
          <label>
            <span class="eyebrow">Email address</span>
            <input class="field" type="email" formControlName="email" />
          </label>
          <label>
            <span class="eyebrow">Password</span>
            <input class="field" type="password" formControlName="password" />
          </label>
          <button class="btn primary" type="submit">
            {{ auth.isAuthenticated() ? 'Refresh session' : 'Login to BookVerse' }}
          </button>

          @if (feedback()) {
            <p class="success-text">{{ feedback() }}</p>
          }
          @if (error()) {
            <p class="danger-text">{{ error() }}</p>
          }

          @if (auth.isAuthenticated()) {
            <a class="btn" routerLink="/wishlist">Go to wishlist</a>
          }
        </form>
      </div>
    </section>
  `,
})
export class LoginPageComponent {
  private readonly builder = inject(FormBuilder);
  readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  readonly feedback = signal('');
  readonly error = signal('');

  readonly form = this.builder.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  submit(): void {
    this.feedback.set('');
    this.error.set('');

    const value = this.form.getRawValue();
    const success = this.auth.login(value.name ?? '', value.email ?? '', value.password ?? '');

    if (!success) {
      this.error.set('Please enter a valid name, email address, and password with at least 6 characters.');
      return;
    }

    this.feedback.set('Login successful. Your member features are now active.');
    const redirect = this.route.snapshot.queryParamMap.get('redirect') || '/';
    void this.router.navigateByUrl(redirect);
  }
}
