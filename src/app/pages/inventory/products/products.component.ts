import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { takeUntil } from 'rxjs';
import { CreateProductModalComponent } from 'src/app/core/components/create-product-modal/create-product-modal.component';
import { UpdateProductModalComponent } from 'src/app/core/components/update-product-modal/update-product-modal.component';
import { IProduct } from 'src/app/core/models/iproduct';
import { ProductsService } from 'src/app/core/services/products.service';
import { Unsubscriber } from 'src/app/core/utils/unsubscriber';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  standalone: true,
  imports: [
    CreateProductModalComponent,
    UpdateProductModalComponent,
    CommonModule,
    NgbDropdownModule,
  ],
})
export class ProductsComponent extends Unsubscriber implements OnInit {
  @ViewChild(CreateProductModalComponent)
  createModalRef!: CreateProductModalComponent;
  products: IProduct[] = [];
  constructor(private productsService: ProductsService) {
    super();
  }

  ngOnInit() {
    this.productsService
      .getProductsList()
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe((products) => (this.products = products));

    this.productsService.productCreatedEvent
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe((product) => {
        this.products.unshift(product);
      });
  }

  createProduct() {
    this.createModalRef.open();
  }

  onEdit(product: IProduct) {
    this.productsService.productEditEvent.emit(product);
  }
}
