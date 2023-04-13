import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutes } from 'src/app/core/routes/app-routes';

const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/overview/overview.component').then(
        (c) => c.OverviewComponent
      ),
  },
  {
    path: AppRoutes.inventory.products,
    loadChildren: () =>
      import('./pages/products/products.module').then((m) => m.ProductsModule),
  },
  {
    path: AppRoutes.inventory.clients,
    loadChildren: () =>
      import('./pages/clients/clients.module').then((m) => m.ClientsModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventoryRoutingModule {}
