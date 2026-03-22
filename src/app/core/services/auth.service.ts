import { computed, Injectable, signal } from '@angular/core';
import { ReaderProfile } from '../models/book.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly storageKey = 'bookverse-user';
  private readonly reader = signal<ReaderProfile | null>(this.readProfile());

  readonly user = this.reader.asReadonly();
  readonly isAuthenticated = computed(() => this.reader() !== null);

  login(name: string, email: string, password: string): boolean {
    if (!name.trim() || !email.trim() || password.trim().length < 6) {
      return false;
    }

    const user = {
      name: name.trim(),
      email: email.trim(),
    };

    this.reader.set(user);
    localStorage.setItem(this.storageKey, JSON.stringify(user));
    return true;
  }

  logout(): void {
    this.reader.set(null);
    localStorage.removeItem(this.storageKey);
  }

  private readProfile(): ReaderProfile | null {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? (JSON.parse(stored) as ReaderProfile) : null;
    } catch {
      return null;
    }
  }
}
