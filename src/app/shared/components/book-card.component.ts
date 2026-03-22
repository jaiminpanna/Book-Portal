import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { PortalStateService } from '../../core/services/portal-state.service';
import { Book } from '../../core/models/book.model';

@Component({
  selector: 'app-book-card',
  imports: [CommonModule, RouterLink],
  template: `
    <article class="book-card">
      <div class="book-cover">
        <small>{{ book().category }}</small>
        <strong>{{ book().title }}</strong>
      </div>

      <div>
        <p class="pill">{{ book().category }}</p>
        <h3 class="book-title">{{ book().title }}</h3>
        <p class="muted">{{ book().spotlight || 'Curated portal pick' }}</p>
      </div>

      <div class="meta-row">
        <span><strong>Writer:</strong> {{ book().author }}</span>
        <span><strong>Published:</strong> {{ book().published }}</span>
      </div>

      <p class="copy">{{ book().description }}</p>

      <div class="action-row">
        <a class="action-button alt" [routerLink]="['/books', book().id]">View details</a>
        <button class="action-button" type="button" (click)="handleWishlist()">
          {{ portal.isWishlisted(book().id) ? 'Wishlisted' : 'Add to wishlist' }}
        </button>
        <button class="action-button" type="button" (click)="handleDownload()">
          {{ portal.isDownloaded(book().id) ? 'Added to downloads' : 'Download' }}
        </button>
        <button class="action-button buy" type="button" (click)="handleBuy()">Buy on Amazon</button>
      </div>
    </article>
  `,
})
export class BookCardComponent {
  readonly book = input.required<Book>();
  readonly portal = inject(PortalStateService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  handleWishlist(): void {
    if (!this.auth.isAuthenticated()) {
      void this.router.navigate(['/login'], { queryParams: { redirect: this.router.url } });
      return;
    }

    this.portal.toggleWishlist(this.book().id);
  }

  handleDownload(): void {
    this.portal.trackDownload(this.book().id);
  }

  handleBuy(): void {
    if (!this.auth.isAuthenticated()) {
      void this.router.navigate(['/login'], { queryParams: { redirect: `/books/${this.book().id}` } });
      return;
    }

    window.open(this.book().amazonUrl, '_blank', 'noopener,noreferrer');
  }
}
