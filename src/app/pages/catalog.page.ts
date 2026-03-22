import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { BookCardComponent } from '../shared/components/book-card.component';
import { PortalStateService } from '../core/services/portal-state.service';

@Component({
  selector: 'app-catalog-page',
  imports: [CommonModule, BookCardComponent],
  template: `
    <section class="section glass-panel">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Book catalog</p>
          <h2 class="section-title">Browse all books with category filters and search</h2>
        </div>
      </div>

      <div class="split-grid">
        <div class="form-card">
          <label class="eyebrow" for="search">Search library</label>
          <input
            id="search"
            class="search-input"
            type="search"
            placeholder="Search by title, author, genre, or year"
            [value]="searchTerm()"
            (input)="searchTerm.set(search.value)"
            #search
          />
        </div>

        <div class="form-card">
          <p class="eyebrow">Genres</p>
          <div class="chip-row">
            <button class="chip" [class.active]="activeCategory() === 'All'" type="button" (click)="activeCategory.set('All')">
              All
            </button>
            @for (category of portal.categories(); track category) {
              <button
                class="chip"
                [class.active]="activeCategory() === category"
                type="button"
                (click)="activeCategory.set(category)"
              >
                {{ category }}
              </button>
            }
          </div>
        </div>
      </div>
    </section>

    <section class="section glass-panel">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Results</p>
          <h2 class="section-title">{{ filteredBooks().length }} books match your current view</h2>
        </div>
      </div>

      @if (filteredBooks().length) {
        <div class="book-grid">
          @for (book of filteredBooks(); track book.id) {
            <app-book-card [book]="book"></app-book-card>
          }
        </div>
      } @else {
        <p class="empty-state">No books matched your filter. Try another category or a wider search phrase.</p>
      }
    </section>
  `,
})
export class CatalogPageComponent {
  readonly portal = inject(PortalStateService);
  readonly searchTerm = signal('');
  readonly activeCategory = signal('All');

  readonly filteredBooks = computed(() => {
    const search = this.searchTerm().trim().toLowerCase();
    const category = this.activeCategory();

    return this.portal.books().filter((book) => {
      const inCategory = category === 'All' || book.category === category;
      const haystack = `${book.title} ${book.author} ${book.category} ${book.published}`.toLowerCase();
      return inCategory && (!search || haystack.includes(search));
    });
  });
}
