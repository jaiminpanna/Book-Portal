import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BookCardComponent } from '../shared/components/book-card.component';
import { AuthService } from '../core/services/auth.service';
import { PortalStateService } from '../core/services/portal-state.service';

@Component({
  selector: 'app-home-page',
  imports: [CommonModule, RouterLink, BookCardComponent],
  template: `
    <section class="section glass-panel">
      <div class="hero-grid">
        <div>
          <p class="eyebrow">Top book reader experience</p>
          <h2 class="display-title">Discover, track, and buy books in a portal built for serious readers.</h2>
          <br>

          <div class="button-row">
            <a class="btn primary" routerLink="/catalog">Browse catalog</a>
            <a class="btn" routerLink="/request-book">Request a book</a>
            <a class="btn secondary" routerLink="/categories">Explore genres</a>
          </div>

          <div class="card-grid" style="margin-top: 1.3rem;">
            <article class="stat-card">
              <strong>{{ portal.books().length }}</strong>
              <span class="muted">Curated books</span>
            </article>
            <article class="stat-card">
              <strong>{{ portal.categories().length }}</strong>
              <span class="muted">Genres available</span>
            </article>
            <article class="stat-card">
              <strong>{{ auth.isAuthenticated() ? 'Member' : 'Guest' }}</strong>
              <span class="muted">Portal access level</span>
            </article>
          </div>
        </div>

        <div class="feature-card">
          <p class="eyebrow">New features added</p><br>
          <div class="list-stack">
            <div class="list-item">
              <strong>Book detail routes</strong>
              <p class="muted">Each book now has its own detail page with related reads and direct actions.</p>
            </div>
            <div class="list-item">
              <strong>Recently viewed shelf</strong>
              <p class="muted">The portal remembers books a reader explored recently for faster revisit flows.</p>
            </div>
            <div class="list-item">
              <strong>Smart recommendation shelf</strong>
              <p class="muted">Suggestions adapt to wishlist, downloads, and recent reading interests.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section glass-panel">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Featured shelf</p>
          <h2 class="section-title">Editor-picked books for growth-minded readers</h2>
        </div>
      </div>

      <div class="book-grid">
        @for (book of portal.featuredBooks(); track book.id) {
          <app-book-card [book]="book"></app-book-card>
        }
      </div>
    </section>

    <section class="section glass-panel">
      <div class="split-grid">
        <article class="shelf-card">
          <p class="eyebrow">Personalized shelf</p>
          <h2 class="section-title">Recommended for you</h2>
          @if (recommendedBooks().length) {
            <div class="list-stack">
              @for (book of recommendedBooks(); track book.id) {
                <a class="list-item" [routerLink]="['/books', book.id]">
                  <strong>{{ book.title }}</strong>
                  <p class="muted">{{ book.author }} · {{ book.category }}</p>
                </a>
              }
            </div>
          } @else {
            <p class="empty-state">Add a few books to your wishlist or open detail pages to unlock smarter suggestions.</p>
          }
        </article>

        <article class="shelf-card">
          <p class="eyebrow">Recently viewed</p>
          <h2 class="section-title">Jump back into your last discoveries</h2>
          @if (portal.recentlyViewedBooks().length) {
            <div class="list-stack">
              @for (book of portal.recentlyViewedBooks(); track book.id) {
                <a class="list-item" [routerLink]="['/books', book.id]">
                  <strong>{{ book.title }}</strong>
                  <p class="muted">{{ book.spotlight }}</p>
                </a>
              }
            </div>
          } @else {
            <p class="empty-state">No recent book views yet. Open any book page from the catalog to start this shelf.</p>
          }
        </article>
      </div>
    </section>
  `,
})
export class HomePageComponent {
  readonly portal = inject(PortalStateService);
  readonly auth = inject(AuthService);
  readonly recommendedBooks = computed(() => this.portal.recommendedBooks());
}
