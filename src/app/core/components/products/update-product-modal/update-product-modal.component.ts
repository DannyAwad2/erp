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
import { CommonModule } from '@angular/common';
import { Observable, takeUntil } from 'rxjs';
import { Unsubscriber } from 'src/app/core/utils/unsubscriber';
import { ICreateProduct } from 'src/app/core/models/form-models/icreate-product';
import { ProductsService } from 'src/app/core/services/products.service';
import { IProduct } from 'src/app/core/models/iproduct';
import { MessagesService } from 'src/app/core/services/messages.service';
import { CategoriesService } from 'src/app/core/services/categories.service';
import { ICategory } from 'src/app/core/models/icategory';

@Component({
  selector: 'app-update-product-modal',
  templateUrl: './update-product-modal.component.html',
  styleUrls: ['./update-product-modal.component.scss'],
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
  categories$!: Observable<ICategory[]>;
  selectedProduct!: IProduct;

  constructor(
    private modalService: NgbModal,
    private entitiesService: ProductsService,
    private messages: MessagesService,
    private categoriesService: CategoriesService
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

    this.entitiesService.onSelected
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe((product) => {
        this.selectedProduct = product;
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

    const updatedEntity: IProduct = {
      id: this.selectedProduct.id,
      cost: this.formControls.cost.value || 0,
      price: this.formControls.price.value || 0,
      category: this.formControls.category.value || '',
      name: this.formControls.name.value || '',
      published: new Date().toISOString(),
      stock: this.formControls.stock.value || 0,
    };

    this.entitiesService
      .update(updatedEntity)
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe(
        (_res) => {
          this.close();
          this.entitiesService.onEdited.next(updatedEntity);
        },
        (error) => {
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
