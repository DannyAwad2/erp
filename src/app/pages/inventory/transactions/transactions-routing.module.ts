import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutes } from 'src/app/core/routes/app-routes';

const routes: Routes = [
  {
    path: AppRoutes.inventory.transactions.purchases.base,
    loadChildren: () =>
      import('./purchases/purchases.module').then((m) => m.PurchasesModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransactionsRoutingModule {}
