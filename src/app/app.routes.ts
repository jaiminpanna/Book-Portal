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
  { path: '', component: HomePageComponent, title: 'Book Portal' },
  { path: 'catalog', component: CatalogPageComponent, title: 'Catalog | Book Portal' },
  { path: 'categories', component: CategoriesPageComponent, title: 'Categories | Book Portal' },
  { path: 'wishlist', component: WishlistPageComponent, canActivate: [authGuard], title: 'Wishlist | Book Portal' },
  { path: 'downloads', component: DownloadsPageComponent, title: 'Downloads | Book Portal' },
  { path: 'request-book', component: RequestBookPageComponent, title: 'Request a Book | Book Portal' },
  { path: 'login', component: LoginPageComponent, title: 'Login | Book Portal' },
  { path: 'books/:id', component: BookDetailPageComponent, title: 'Book Details | Book Portal' },
  { path: '**', redirectTo: '' },
];
