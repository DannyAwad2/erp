import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutes } from '../core/routes/app-routes';

const routes: Routes = [
  {
    path: AppRoutes.home,
    loadComponent: () =>
      import('./home/home.component').then((c) => c.HomeComponent),
  },
  {
    path: AppRoutes.inventory.base,
    loadChildren: () =>
      import('./inventory/inventory.module').then((m) => m.InventoryModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
