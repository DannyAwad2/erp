import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { TransactionsModule } from './pages/inventory/transactions/transactions.module';
import { PurchasesModule } from './pages/inventory/transactions/purchases/purchases.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, NgbModule, HttpClientModule, TransactionsModule, PurchasesModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
