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
  entityFormModalRef!: productFormModalComponent;
  entities: IProduct[] = [];
  fliterdEntites: IProduct[] = [];
  isError = false;
  isLoading = false;
  categories$!: Observable<ICategory[]>;
  currCategory: string = '';
  products$!: Observable<IProduct[]>;

  constructor(
    private productsService: ProductsService,
    private catService: CategoriesService,
    private messages: MessagesService
  ) {
    super();
  }

  ngOnInit() {
    this.fetchEntities();
    this.categories$ = this.catService.getAll();

    this.productsService.onCreated
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe((entity) => {
        this.entities.reverse().unshift(entity);
        this.fliterdEntites = this.entities;
      });

    this.productsService.onEdited
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe((entity) => {
        const index = this.fliterdEntites.findIndex((p) => p.id === entity.id);
        console.log(index);

        this.fliterdEntites.splice(index, 1, entity);
        this.entities = this.fliterdEntites;
        this.messages.toast('تم التعديل بنجاح', 'success');
      });

    this.products$ = this.productsService.getAll().pipe(
      tap((data) => {
        this.isLoading = false;
        this.isError = false;
        return data;
      })
    );
  }

  fetchEntities() {
    this.isError = false;
    this.isLoading = true;
    this.productsService.getAll().subscribe({
      next: (data) => {
        this.isError = false;
        this.isLoading = false;
        this.entities = this.fliterdEntites = data;
      },
    });
  }

  createEntity() {
    this.entityFormModalRef.open();
  }

  editEntry(entity: IProduct) {
    this.entityFormModalRef.form.patchValue({
      ...entity,
    });
    this.entityFormModalRef.open();
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
            this.entities.splice(index, 1);
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
      this.fliterdEntites = this.entities;
      return;
    }
    this.fliterdEntites = this.entities.filter((entity) =>
      entity.name.toLowerCase().includes(term.target.value.toLowerCase())
    );
  }

  handlPageSizeSelection(pageSize: number) {
    this.isError = false;
    this.isLoading = true;
    this.productsService.onPageSizeChange.next(pageSize);
  }
}
