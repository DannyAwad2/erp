import { Component, OnInit, ViewChild } from '@angular/core';
import { CreateProductModalComponent } from 'src/app/core/components/create-product-modal/create-product-modal.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  standalone: true,
  imports: [CreateProductModalComponent],
})
export class ProductsComponent implements OnInit {
  @ViewChild(CreateProductModalComponent)
  createModalRef!: CreateProductModalComponent;
  constructor() {}

  ngOnInit() {}

  createProduct() {
    this.createModalRef.open();
  }
}
