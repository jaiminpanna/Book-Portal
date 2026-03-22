import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { BookDetailPageComponent } from './pages/book-detail.page';
import { CatalogPageComponent } from './pages/catalog.page';
import { CategoriesPageComponent } from './pages/categories.page';
import { DownloadsPageComponent } from './pages/downloads.page';
import { HomePageComponent } from './pages/home.page';
import { LoginPageComponent } from './pages/login.page';
import { RequestBookPageComponent } from './pages/request-book.page';
import { WishlistPageComponent } from './pages/wishlist.page';

export const routes: Routes = [
  { path: '', component: HomePageComponent, title: 'BookVerse Portal' },
  { path: 'catalog', component: CatalogPageComponent, title: 'Catalog | BookVerse Portal' },
  { path: 'categories', component: CategoriesPageComponent, title: 'Categories | BookVerse Portal' },
  { path: 'wishlist', component: WishlistPageComponent, canActivate: [authGuard], title: 'Wishlist | BookVerse Portal' },
  { path: 'downloads', component: DownloadsPageComponent, title: 'Downloads | BookVerse Portal' },
  { path: 'request-book', component: RequestBookPageComponent, title: 'Request a Book | BookVerse Portal' },
  { path: 'login', component: LoginPageComponent, title: 'Login | BookVerse Portal' },
  { path: 'books/:id', component: BookDetailPageComponent, title: 'Book Details | BookVerse Portal' },
  { path: '**', redirectTo: '' },
];
