import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PortalStateService } from '../core/services/portal-state.service';

@Component({
  selector: 'app-categories-page',
  imports: [CommonModule, RouterLink],
  template: `
    <section class="section glass-panel">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Genres and shelves</p>
          <h2 class="section-title">Navigate the portal by category</h2>
        </div>
      </div>

      <div class="card-grid">
        @for (category of portal.categories(); track category) {
          <article class="feature-card">
            <p class="pill">{{ category }}</p>
            <h3 class="book-title">{{ portal.booksByCategory(category).length }} books</h3>
            <div class="list-stack">
              @for (book of portal.booksByCategory(category).slice(0, 3); track book.id) {
                <a class="list-item" [routerLink]="['/books', book.id]">
                  <strong>{{ book.title }}</strong>
                  <p class="muted">{{ book.author }} · {{ book.published }}</p>
                </a>
              }
            </div>
          </article>
        }
      </div>
    </section>
  `,
})
export class CategoriesPageComponent {
  readonly portal = inject(PortalStateService);
}
