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
import { IProduct } from '../../../models/iproduct';
import { Unsubscriber } from '../../../utils/unsubscriber';
import { MessagesService } from 'src/app/core/services/messages.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { Observable } from 'rxjs';
import { ICategory } from 'src/app/core/models/icategory';
import { CategoriesService } from 'src/app/core/services/categories.service';

@Component({
  selector: 'app-create-product-modal',
  templateUrl: './create-product-modal.component.html',
  styleUrls: ['./create-product-modal.component.scss'],
  standalone: true,
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

  constructor(
    private entitiesService: ProductsService,
    private messages: MessagesService,
    private categoriesService: CategoriesService,
    private modalService: NgbModal
  ) {
    super();
  }

  ngOnInit() {
    this.form = new FormGroup<ICreateProduct>({
      categoryId: new FormControl(null, Validators.required),
      name: new FormControl(null, Validators.required),
      price: new FormControl(null, Validators.required),
      stock: new FormControl(null, Validators.required),
      cost: new FormControl(null, Validators.required),
    });
    this.categories$ = this.categoriesService.getAll();
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

    const freshEntity: IProduct = {
      id: 0,
      cost: this.formControls.cost.value || 0,
      price: this.formControls.price.value || 0,
      categoryId: this.formControls.categoryId.value || 0,
      name: this.formControls.name.value || '',
      published: new Date().toISOString(),
      stock: this.formControls.stock.value || 0,
    };

    this.entitiesService.create(freshEntity).subscribe(
      () => {
        this.close();
      },
      () => {
        this.form.enable();
        this.isSubmiting = false;
        this.messages.toast('خطأ في الشبكة', 'error');
      }
    );
  }

  get formControls() {
    return this.form.controls;
  }
}
