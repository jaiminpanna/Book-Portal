import { computed, Injectable, signal } from '@angular/core';
import { BOOKS } from '../data/books.data';
import { Book, BookRequest } from '../models/book.model';

@Injectable({
  providedIn: 'root',
})
export class PortalStateService {
  private readonly wishlistKey = 'bookverse-wishlist';
  private readonly downloadsKey = 'bookverse-downloads';
  private readonly recentKey = 'bookverse-recent';
  private readonly requestsKey = 'bookverse-requests';

  readonly books = signal<Book[]>(BOOKS);
  readonly wishlistIds = signal<string[]>(this.readStringList(this.wishlistKey));
  readonly downloadIds = signal<string[]>(this.readStringList(this.downloadsKey));
  readonly recentIds = signal<string[]>(this.readStringList(this.recentKey));
  readonly requests = signal<BookRequest[]>(this.readRequests());

  readonly categories = computed(() =>
    [...new Set(this.books().map((book) => book.category))].sort((left, right) => left.localeCompare(right)),
  );

  readonly featuredBooks = computed(() => this.books().filter((book) => book.featured));

  readonly wishlistBooks = computed(() => this.mapIdsToBooks(this.wishlistIds()));
  readonly downloadedBooks = computed(() => this.mapIdsToBooks(this.downloadIds()));
  readonly recentlyViewedBooks = computed(() => this.mapIdsToBooks(this.recentIds()));

  readonly recommendedBooks = computed(() => {
    const interestCategories = [
      ...this.wishlistBooks().map((book) => book.category),
      ...this.recentlyViewedBooks().map((book) => book.category),
      ...this.downloadedBooks().map((book) => book.category),
    ];

    const rankedCategories = [...new Set(interestCategories)];
    const selectedIds = new Set([
      ...this.wishlistIds(),
      ...this.downloadIds(),
      ...this.recentIds(),
    ]);

    const prioritized = this.books().filter(
      (book) => rankedCategories.includes(book.category) && !selectedIds.has(book.id),
    );
    return prioritized.slice(0, 4);
  });

  bookById(id: string): Book | undefined {
    return this.books().find((book) => book.id === id);
  }

  booksByCategory(category: string): Book[] {
    return this.books().filter((book) => book.category === category);
  }

  toggleWishlist(bookId: string): void {
    const next = this.wishlistIds().includes(bookId)
      ? this.wishlistIds().filter((id) => id !== bookId)
      : [bookId, ...this.wishlistIds()];

    this.wishlistIds.set(next);
    this.writeStringList(this.wishlistKey, next);
  }

  trackDownload(bookId: string): void {
    if (this.downloadIds().includes(bookId)) {
      return;
    }

    const next = [bookId, ...this.downloadIds()];
    this.downloadIds.set(next);
    this.writeStringList(this.downloadsKey, next);
  }

  trackRecent(bookId: string): void {
    const next = [bookId, ...this.recentIds().filter((id) => id !== bookId)].slice(0, 6);
    this.recentIds.set(next);
    this.writeStringList(this.recentKey, next);
  }

  addRequest(request: Omit<BookRequest, 'createdAt'>): void {
    const nextRequest: BookRequest = {
      ...request,
      createdAt: new Date().toLocaleString(),
    };
    const next = [nextRequest, ...this.requests()].slice(0, 8);
    this.requests.set(next);
    localStorage.setItem(this.requestsKey, JSON.stringify(next));
  }

  isWishlisted(bookId: string): boolean {
    return this.wishlistIds().includes(bookId);
  }

  isDownloaded(bookId: string): boolean {
    return this.downloadIds().includes(bookId);
  }

  private mapIdsToBooks(ids: string[]): Book[] {
    return ids
      .map((id) => this.bookById(id))
      .filter((book): book is Book => Boolean(book));
  }

  private readStringList(key: string): string[] {
    try {
      const stored = localStorage.getItem(key);
      return stored ? (JSON.parse(stored) as string[]) : [];
    } catch {
      return [];
    }
  }

  private writeStringList(key: string, values: string[]): void {
    localStorage.setItem(key, JSON.stringify(values));
  }

  private readRequests(): BookRequest[] {
    try {
      const stored = localStorage.getItem(this.requestsKey);
      return stored ? (JSON.parse(stored) as BookRequest[]) : [];
    } catch {
      return [];
    }
  }
}
