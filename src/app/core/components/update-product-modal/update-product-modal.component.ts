import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  NgbModalRef,
  NgbModal,
  NgbDatepickerModule,
} from '@ng-bootstrap/ng-bootstrap';
import { ICreateProduct } from '../../models/form-models/icreate-product';
import { IProduct } from '../../models/iproduct';
import { ProductsService } from '../../services/products.service';
import { Unsubscriber } from '../../utils/unsubscriber';
import { CommonModule } from '@angular/common';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-update-product-modal',
  templateUrl: './update-product-modal.component.html',
  styleUrls: ['./update-product-modal.component.scss'],
  standalone: true,
  imports: [NgbDatepickerModule, ReactiveFormsModule, CommonModule],
})
export class UpdateProductModalComponent
  extends Unsubscriber
  implements OnInit
{
  @ViewChild('content') modalContent: any;
  form!: FormGroup<ICreateProduct>;
  activeModalRef!: NgbModalRef;
  isSubmiting = false;
  id: number = 0;

  constructor(
    private modalService: NgbModal,
    private productsService: ProductsService
  ) {
    super();
  }

  ngOnInit() {
    this.form = new FormGroup<ICreateProduct>({
      category: new FormControl(null, Validators.required),
      name: new FormControl(null, Validators.required),
      price: new FormControl(null, Validators.required),
      stock: new FormControl(null, Validators.required),
      cost: new FormControl(null, Validators.required),
    });

    this.productsService.productSelectedEvent
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe((product) => {
        (this.id = product.id),
          this.form.patchValue({
            name: product.name,
            category: product.category,
            cost: product.cost,
            price: product.price,
            stock: product.stock,
          });
        this.open();
      });
  }

  open() {
    this.activeModalRef = this.modalService.open(this.modalContent, {
      centered: true,
    });
  }

  close() {
    this.form.reset();
    this.form.enable();
    this.isSubmiting = false;
    this.activeModalRef.close();
    this.unsubscriber$.next();
    this.unsubscriber$.complete();
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.form.disable();
    this.isSubmiting = true;

    const updatedProduct: IProduct = {
      id: this.id,
      cost: this.formControls.cost.value || 0,
      price: this.formControls.price.value || 0,
      category: this.formControls.category.value || '',
      name: this.formControls.name.value || '',
      published: new Date().toISOString(),
      stock: this.formControls.stock.value || 0,
    };

    this.productsService
      .updateProduct(updatedProduct)
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe((product) => {
        this.close();
        this.productsService.productEditedEvent.emit(product);
      });
  }

  get formControls() {
    return this.form.controls;
  }
}
