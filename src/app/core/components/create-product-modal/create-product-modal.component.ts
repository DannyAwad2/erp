import { Component, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  NgbDatepickerModule,
  NgbModal,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';

import { ICreateProduct } from '../../models/form-models/icreate-product';
import { ProductsService } from '../../services/products.service';
import { IProduct } from '../../models/iproduct';

@Component({
  selector: 'app-create-product-modal',
  templateUrl: './create-product-modal.component.html',
  styleUrls: ['./create-product-modal.component.css'],
  standalone: true,
  imports: [NgbDatepickerModule, ReactiveFormsModule, CommonModule],
})
export class CreateProductModalComponent implements OnInit {
  @ViewChild('content') modalContent: any;
  form!: FormGroup<ICreateProduct>;
  activeModalRef!: NgbModalRef;
  isSubmiting = false;

  constructor(
    private modalService: NgbModal,
    private productsService: ProductsService
  ) {}

  ngOnInit() {
    this.form = new FormGroup<ICreateProduct>({
      category: new FormControl(null, Validators.required),
      name: new FormControl(null, Validators.required),
      price: new FormControl(null, Validators.required),
      stock: new FormControl(null, Validators.required),
      cost: new FormControl(null, Validators.required),
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
    this.activeModalRef.close();
    this.isSubmiting = false;
  }

  onSubmit() {
    console.log(this.form);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.form.disable();
    this.isSubmiting = true;

    const freshProduct: IProduct = {
      cost: this.formControls.cost.value || 0,
      price: this.formControls.price.value || 0,
      category: this.formControls.category.value || '',
      name: this.formControls.name.value || '',
      published: new Date().toISOString(),
      stock: this.formControls.stock.value || 0,
    };

    this.productsService.createProduct(freshProduct).subscribe((product) => {
      this.close();
    });
  }

  get formControls() {
    return this.form.controls;
  }
}
