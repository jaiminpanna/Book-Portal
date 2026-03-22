import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { PortalStateService } from './core/services/portal-state.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  readonly auth = inject(AuthService);
  readonly portal = inject(PortalStateService);
  readonly currentReaderLabel = computed(() => this.auth.user()?.name ?? 'Guest Reader');

  logout(): void {
    this.auth.logout();
  }
}
