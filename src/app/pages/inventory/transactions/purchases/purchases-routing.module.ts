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
    path: AppRoutes.inventory.transactions.purchases.new,
    loadComponent: () =>
      import('./new/new.component').then((c) => c.NewComponent),
  },
  {
    path: AppRoutes.inventory.transactions.purchases.edit,
    loadComponent: () =>
      import('./edit/edit.component').then((c) => c.EditComponent),
  },
  {
    path: AppRoutes.inventory.transactions.purchases.return,
    loadComponent: () =>
      import('./return/return.component').then((c) => c.ReturnComponent),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PurchasesRoutingModule {}
