import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { BookCardComponent } from '../shared/components/book-card.component';
import { PortalStateService } from '../core/services/portal-state.service';

@Component({
  selector: 'app-wishlist-page',
  imports: [CommonModule, BookCardComponent],
  template: `
    <section class="section glass-panel">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Wishlist</p>
          <h2 class="section-title">Your saved books shelf</h2>
        </div>
      </div>

      @if (portal.wishlistBooks().length) {
        <div class="book-grid">
          @for (book of portal.wishlistBooks(); track book.id) {
            <app-book-card [book]="book"></app-book-card>
          }
        </div>
      } @else {
        <p class="empty-state">Your wishlist is empty. Sign in and save books from the catalog to build this shelf.</p>
      }
    </section>
  `,
})
export class WishlistPageComponent {
  readonly portal = inject(PortalStateService);
}
