import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PortalStateService } from '../core/services/portal-state.service';

@Component({
  selector: 'app-downloads-page',
  imports: [CommonModule, RouterLink],
  template: `
    <section class="section glass-panel">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Downloads tracker</p>
          <h2 class="section-title">Books added to the download queue</h2>
        </div>
      </div>

      @if (portal.downloadedBooks().length) {
        <div class="list-stack">
          @for (book of portal.downloadedBooks(); track book.id) {
            <article class="list-item">
              <div class="section-heading" style="margin-bottom: 0;">
                <div>
                  <strong>{{ book.title }}</strong>
                  <p class="muted">{{ book.author }} · {{ book.category }} · {{ book.published }}</p>
                </div>
                <a class="btn" [routerLink]="['/books', book.id]">Open detail page</a>
              </div>
              <p class="copy">Download links are still placeholders for now, but this queue is ready for real file URLs later.</p>
            </article>
          }
        </div>
      } @else {
        <p class="empty-state">No downloads added yet. Use the catalog or book detail pages to start this list.</p>
      }
    </section>
  `,
})
export class DownloadsPageComponent {
  readonly portal = inject(PortalStateService);
}
