import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { catchError, Observable, takeUntil, tap } from 'rxjs';
import { CreateProductModalComponent as productFormModalComponent } from 'src/app/core/components/products/create-product-modal/create-product-modal.component';
import { SpinnerComponent } from 'src/app/core/components/spinner/spinner.component';
import { ICategory } from 'src/app/core/models/icategory';
import { IProduct } from 'src/app/core/models/iproduct';
import { CategoriesService } from 'src/app/core/services/categories.service';
import { MessagesService } from 'src/app/core/services/messages.service';
import { ProductsService } from 'src/app/core/services/products.service';
import { Unsubscriber } from 'src/app/core/utils/unsubscriber';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  imports: [
    productFormModalComponent,
    CommonModule,
    NgbDropdownModule,
    FormsModule,
    SpinnerComponent,
  ],
})
export class OverviewComponent extends Unsubscriber implements OnInit {
  @ViewChild(productFormModalComponent)
  productFormModalRef!: productFormModalComponent;
  products: IProduct[] = [];
  fliterdProducts: IProduct[] = [];
  isError = false;
  isLoading = false;
  categories$!: Observable<ICategory[]>;

  constructor(
    private productsService: ProductsService,
    private catService: CategoriesService,
    private messages: MessagesService
  ) {
    super();
  }

  ngOnInit() {
    this.fetchProducts();
    this.categories$ = this.catService.getAll();

    this.productsService.onCreated
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe((entity) => {
        this.products.reverse();
        this.products.push(entity);
        this.products.reverse();
        this.fliterdProducts = this.products;
      });

    this.productsService.onEdited
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe((entity) => {
        const index = this.fliterdProducts.findIndex((p) => p.id === entity.id);
        this.fliterdProducts.splice(index, 1, entity);
        this.products = this.fliterdProducts;
      });
  }

  fetchProducts() {
    this.isError = false;
    this.isLoading = true;
    this.productsService.getAll().subscribe({
      next: (data) => {
        this.isError = false;
        this.isLoading = false;
        this.products = this.fliterdProducts = data;
      },
      error: () => {
        this.isError = true;
        this.isLoading = false;
      },
    });
  }

  createProduct() {
    this.productFormModalRef.open(null);
  }

  editProduct(entity: IProduct) {
    this.productFormModalRef.form.patchValue({
      ...entity,
    });
    this.productFormModalRef.open({ ...entity });
  }

  async onDelete(entity: IProduct, index: number) {
    const { isConfirmed } = await this.messages.deleteConfirm(entity.name);
    if (isConfirmed) {
      this.isLoading = true;
      this.productsService
        .delete(entity.id ?? '1')
        .pipe(takeUntil(this.unsubscriber$))
        .subscribe({
          next: () => {
            this.messages.deletedToast(entity.name);
            this.products.splice(index, 1);
            this.isLoading = false;
            this.isError = false;
          },
          error: () => {
            this.messages.toast('خطأ ما في الشبكة', 'error');
            this.isLoading = false;
          },
        });
    }
  }

  onFilter(term: any) {
    if (term.target.value.trim() === '') {
      this.fliterdProducts = this.products;
      return;
    }
    this.fliterdProducts = this.products.filter((entity) =>
      entity.name.toLowerCase().includes(term.target.value.toLowerCase())
    );
  }
}
