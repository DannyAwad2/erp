import { Component, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  NgbDatepickerModule,
  NgbModal,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';

import { ICreateProduct } from '../../../models/form-models/icreate-product';
import { ProductsService } from '../../../services/products.service';
import { Unsubscriber } from '../../../utils/unsubscriber';
import { NgSelectModule } from '@ng-select/ng-select';
import { Observable, takeUntil } from 'rxjs';
import { ICategory } from 'src/app/core/models/icategory';
import { CategoriesService } from 'src/app/core/services/categories.service';
import { IProduct } from 'src/app/core/models/iproduct';

@Component({
  selector: 'app-create-product-modal',
  templateUrl: './create-product-modal.component.html',
  styleUrls: ['./create-product-modal.component.scss'],
  imports: [
    NgbDatepickerModule,
    ReactiveFormsModule,
    CommonModule,
    NgSelectModule,
  ],
})
export class CreateProductModalComponent
  extends Unsubscriber
  implements OnInit
{
  @ViewChild('content') modalContent: any;
  form!: FormGroup<ICreateProduct>;
  activeModalRef!: NgbModalRef;
  isSubmiting = false;
  categories$!: Observable<ICategory[]>;
  product: IProduct | null = null;

  constructor(
    private productsService: ProductsService,
    private categoriesService: CategoriesService,
    private modalService: NgbModal
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
    this.categories$ = this.categoriesService.getAll();
  }

  open(product: IProduct | null) {
    this.product = product;
    this.activeModalRef = this.modalService.open(this.modalContent, {
      centered: true,
    });
  }

  close() {
    this.form.reset();
    this.form.enable();
    this.activeModalRef.close();
    this.isSubmiting = false;
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

    const freshEntity = {
      cost: this.formControls.cost.value || 0,
      price: this.formControls.price.value || 0,
      category: this.formControls.category.value || 'uncategorized',
      name: this.formControls.name.value || '',
      published: new Date().toISOString(),
      stock: this.formControls.stock.value || 1,
    };

    if (this.product) {
      this.productsService
        .update({ ...this.product, ...freshEntity })
        .pipe(takeUntil(this.unsubscriber$))
        .subscribe({
          next: () => {
            this.productsService.onPageSizeChange.next(10);
            this.close();
          },
          error: () => {
            this.form.enable();
            this.isSubmiting = false;
          },
        });
    } else {
      this.productsService
        .create(freshEntity)
        .pipe(takeUntil(this.unsubscriber$))
        .subscribe({
          next: () => {
            this.productsService.onPageSizeChange.next(10);
            this.close();
          },
          error: () => {
            this.form.enable();
            this.isSubmiting = false;
          },
        });
    }
  }

  get formControls() {
    return this.form.controls;
  }
}
