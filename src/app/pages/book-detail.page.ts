import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { PortalStateService } from '../core/services/portal-state.service';
import { BookCardComponent } from '../shared/components/book-card.component';

@Component({
  selector: 'app-book-detail-page',
  imports: [CommonModule, RouterLink, BookCardComponent],
  template: `
    @if (book(); as selectedBook) {
      <section class="section glass-panel">
        <div class="detail-grid">
          <article class="detail-card">
            <div class="book-cover" style="min-height: 260px;">
              <small>{{ selectedBook.category }}</small>
              <strong>{{ selectedBook.title }}</strong>
            </div>
          </article>

          <article class="detail-card list-stack">
            <div>
              <p class="eyebrow">Book detail page</p>
              <h2 class="section-title">{{ selectedBook.title }}</h2>
              <p class="copy">{{ selectedBook.description }}</p>
            </div>

            <div class="meta-row">
              <span><strong>Writer:</strong> {{ selectedBook.author }}</span>
              <span><strong>Published:</strong> {{ selectedBook.published }}</span>
              <span><strong>Genre:</strong> {{ selectedBook.category }}</span>
            </div>

            <div class="action-row">
              <button class="action-button" type="button" (click)="toggleWishlist(selectedBook.id)">
                {{ portal.isWishlisted(selectedBook.id) ? 'Wishlisted' : 'Add to wishlist' }}
              </button>
              <button class="action-button" type="button" (click)="download(selectedBook.id)">Download</button>
              <button class="action-button buy" type="button" (click)="buy(selectedBook.amazonUrl, selectedBook.id)">
                Buy on Amazon
              </button>
            </div>

            <p class="muted">Download currently tracks the book in your portal downloads list until file links are attached.</p>
          </article>
        </div>
      </section>

      <section class="section glass-panel">
        <div class="section-heading">
          <div>
            <p class="eyebrow">Related reads</p>
            <h2 class="section-title">More from {{ selectedBook.category }}</h2>
          </div>
        </div>

        <div class="book-grid">
          @for (relatedBook of relatedBooks(); track relatedBook.id) {
            <app-book-card [book]="relatedBook"></app-book-card>
          }
        </div>
      </section>
    } @else {
      <section class="section glass-panel">
        <p class="empty-state">We could not find that book. Return to the catalog to keep exploring.</p>
        <a class="btn primary" routerLink="/catalog">Back to catalog</a>
      </section>
    }
  `,
})
export class BookDetailPageComponent {
  readonly portal = inject(PortalStateService);
  readonly auth = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly book = computed(() => {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    return this.portal.bookById(id);
  });

  readonly relatedBooks = computed(() => {
    const selected = this.book();
    if (!selected) {
      return [];
    }

    return this.portal
      .booksByCategory(selected.category)
      .filter((book) => book.id !== selected.id)
      .slice(0, 3);
  });

  constructor() {
    effect(
      () => {
        const selected = this.book();
        if (selected) {
          this.portal.trackRecent(selected.id);
        }
      },
      { allowSignalWrites: true },
    );
  }

  toggleWishlist(bookId: string): void {
    if (!this.auth.isAuthenticated()) {
      void this.router.navigate(['/login'], { queryParams: { redirect: `/books/${bookId}` } });
      return;
    }

    this.portal.toggleWishlist(bookId);
  }

  download(bookId: string): void {
    this.portal.trackDownload(bookId);
  }

  buy(url: string, bookId: string): void {
    if (!this.auth.isAuthenticated()) {
      void this.router.navigate(['/login'], { queryParams: { redirect: `/books/${bookId}` } });
      return;
    }

    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
