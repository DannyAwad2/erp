import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/overview/overview.component').then(
        (m) => m.OverviewComponent
      ),
  },
  {
    path: 'invoice/:id',
    loadComponent: () =>
      import('./pages/invoice/invoice.component').then(
        (c) => c.InvoiceComponent
      ),
  },
  {
    path: 'receipt/:id',
    loadComponent: () =>
      import('./pages/receipt/receipt.component').then(
        (c) => c.ReceiptComponent
      ),
  },
  {
    path: 'return/:id',
    loadComponent: () =>
      import('./pages/return/return.component').then((c) => c.ReturnComponent),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransactionsRoutingModule {}
