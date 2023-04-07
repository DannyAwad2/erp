import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
  FormsModule,
  NgModel,
} from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { Observable, Subject, takeUntil } from 'rxjs';
import { IProduct } from 'src/app/core/models/iproduct';
import { IPruchaseCart } from 'src/app/core/models/ipurchase-cart';
import { ProductsService } from 'src/app/core/services/products.service';
import { Unsubscriber } from 'src/app/core/utils/unsubscriber';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss'],
  standalone: true,
  imports: [CommonModule, NgSelectModule, FormsModule],
})
export class NewComponent extends Unsubscriber implements OnInit {
  product$ = new Subject<IProduct>();
  purchaseCart!: IPruchaseCart;
  products$!: Observable<IProduct[]>;

  constructor(
    private modalService: NgbModal,
    private productsService: ProductsService
  ) {
    super();
    this.purchaseCart = {
      id: 0,
      products: [],
      totalStock: 0,
      totalCost: 0,
      transType: 'pruchase',
    };
  }

  ngOnInit(): void {
    this.product$.pipe(takeUntil(this.unsubscriber$)).subscribe((product) => {
      console.log(product);

      // // update the cost and add the product to the cart
      // product.cost = product.cost * product.stock;
      // this.purchaseCart.products.push(product);
      // // upadte the total stock and total cost
      // this.purchaseCart.totalStock = 0;
      // this.purchaseCart.totalCost = 0;
      // this.purchaseCart.products.forEach((p) => {
      //   this.purchaseCart.totalStock += p.stock;
      //   this.purchaseCart.totalCost += p.cost;
      // });
    });

    this.products$ = this.productsService.getAll();
  }

  addProduct(product: IProduct) {
    this.product$.next(product);
  }

  removeProduct(product: IProduct) {
    const index = this.purchaseCart.products.indexOf(product);
    this.purchaseCart.products.splice(index, 1);
    this.purchaseCart.totalStock -= product.stock;
    this.purchaseCart.totalCost -= product.price;
  }

  updateProduct(product: IProduct) {
    const index = this.purchaseCart.products.indexOf(product);
    this.purchaseCart.products[index] = product;
    this.purchaseCart.totalStock = 0;
    this.purchaseCart.totalCost = 0;
    this.purchaseCart.products.forEach((p) => {
      this.purchaseCart.totalStock += p.stock;
      this.purchaseCart.totalCost += p.cost;
    });
  }

  onSave() {
    console.log(this.purchaseCart);
  }

  // Modal

  openModal(content: TemplateRef<any>) {
    this.modalService.open(content, { size: 'lg' });
  }

  onProductAdded(model: NgModel) {
    const product: IProduct = {
      id: model.value.id,
      name: model.value.name,
      price: 0,
      stock: model.value.stock,
      cost: model.value.price * model.value.stock,
      categoryId: model.value.categoryId,
      published: '',
    };

    this.addProduct(model.value);
    model.value.price = 0;
    model.value.stock = 0;
    model.value.name = '';
    model.value.id = 0;
  }
}
