import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutes } from 'src/app/core/routes/app-routes';

const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./overview/overview.component').then((c) => c.OverviewComponent),
  },
  {
    path: AppRoutes.inventory.products,
    loadComponent: () =>
      import('./products/products.component').then((c) => c.ProductsComponent),
  },
  {
    path: AppRoutes.inventory.categories,
    loadComponent: () =>
      import('./categories/categories.component').then(
        (c) => c.CategoriesComponent
      ),
  },
  {
    path: AppRoutes.inventory.transactions.base,
    loadChildren: () =>
      import('./transactions/transactions.module').then(
        (m) => m.TransactionsModule
      ),
  },
  {
    path: AppRoutes.inventory.clients,
    loadComponent: () =>
      import('./clients/clients.component').then((c) => c.ClientsComponent),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventoryRoutingModule {}
