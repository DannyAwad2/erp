import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable, takeUntil } from 'rxjs';
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

  constructor(
    private productsService: ProductsService,
    private catService: CategoriesService,
    private messages: MessagesService
  ) {
    super();
  }

  ngOnInit() {
    this.categories$ = this.catService.getAll();
    this.fetchEntities('');

    this.productsService.onCreated
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe((entity) => {
        this.entities.unshift(entity);
        this.fliterdEntites = this.entities;
      });

    this.productsService.onEdited
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe((entity) => {
        const index = this.fliterdEntites.findIndex((p) => p.id === entity.id);
        this.fliterdEntites.splice(index, 1, entity);
        this.fliterdEntites = this.entities;
        this.messages.toast('تم التعديل بنجاح', 'success');
      });
  }

  fetchEntities(category: string) {
    if (category) {
      this.handleCatSelection(category);
    } else {
      this.isError = false;
      this.isLoading = true;
      this.productsService
        .getAll()
        .pipe(takeUntil(this.unsubscriber$))
        .subscribe({
          next: (entities) => {
            this.entities = entities;
            this.fliterdEntites = entities;
            this.isError = false;
            this.isLoading = false;
          },
          error: (error) => {
            console.log(error);

            this.isError = true;
            this.isLoading = true;
          },
        });
    }
  }

  createEntity() {
    this.entityFormModalRef.mode = 'new';
    this.entityFormModalRef.open();
  }

  editEntry(entity: IProduct) {
    this.entityFormModalRef.form.patchValue({
      ...entity,
    });
    this.entityFormModalRef.mode = 'edit';
    this.entityFormModalRef.open();
  }

  async onDelete(entity: IProduct, index: number) {
    const { isConfirmed } = await this.messages.deleteConfirm(entity.name);
    if (isConfirmed) {
      this.isLoading = true;
      this.productsService
        .delete(entity.id)
        .pipe(takeUntil(this.unsubscriber$))
        .subscribe({
          next: (res) => {
            this.messages.deletedToast(entity.name);
            this.entities.splice(index, 1);
            this.isLoading = false;
            this.isError = false;
          },
          error: (err) => {
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

  handleCatSelection(name: string) {
    this.isError = false;
    this.isLoading = true;
    this.productsService
      .getByCatName(name)
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe({
        next: (entities) => {
          this.entities = entities;
          this.fliterdEntites = entities;
          this.isError = false;
          this.isLoading = false;
        },
        error: (error) => {
          console.log(error);

          this.isError = true;
          this.isLoading = true;
        },
      });
  }
}
