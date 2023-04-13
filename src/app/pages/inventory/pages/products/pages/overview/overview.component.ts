import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { takeUntil } from 'rxjs';
import { CreateProductModalComponent } from 'src/app/core/components/products/create-product-modal/create-product-modal.component';
import { UpdateProductModalComponent } from 'src/app/core/components/products/update-product-modal/update-product-modal.component';
import { IProduct } from 'src/app/core/models/iproduct';
import { MessagesService } from 'src/app/core/services/messages.service';
import { ProductsService } from 'src/app/core/services/products.service';
import { Unsubscriber } from 'src/app/core/utils/unsubscriber';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  standalone: true,
  imports: [
    CreateProductModalComponent,
    UpdateProductModalComponent,
    CommonModule,
    NgbDropdownModule,
    FormsModule,
  ],
})
export class OverviewComponent extends Unsubscriber implements OnInit {
  @ViewChild(CreateProductModalComponent)
  createEntityModalRef!: CreateProductModalComponent;
  entities: IProduct[] = [];
  fliterdEntites: IProduct[] = [];
  isError = false;
  isLoading = false;

  constructor(
    private entityService: ProductsService,
    private messages: MessagesService
  ) {
    super();
  }

  ngOnInit() {
    this.fetchEntities();

    this.entityService.onCreated
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe((entity) => {
        this.entities.unshift(entity);
        this.fliterdEntites = this.entities;
      });

    this.entityService.onEdited
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe((entity) => {
        const index = this.fliterdEntites.findIndex((p) => p.id === entity.id);
        this.fliterdEntites.splice(index, 1, entity);
        this.fliterdEntites = this.entities;
        this.messages.toast('تم التعديل بنجاح', 'success');
      });
  }

  fetchEntities() {
    this.isError = false;
    this.isLoading = true;
    this.entityService
      .getAll()
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe(
        (entities) => {
          this.entities = entities;
          this.fliterdEntites = entities;
          this.isError = false;
          this.isLoading = false;
        },
        () => {
          this.isError = true;
          this.isLoading = true;
        }
      );
  }

  createEntity() {
    this.createEntityModalRef.open();
  }

  onEdit(entity: IProduct) {
    this.entityService.onSelected.next(entity);
  }

  async onDelete(entity: IProduct, index: number) {
    const { isConfirmed } = await this.messages.deleteConfirm(entity.name);
    if (isConfirmed) {
      this.isLoading = true;
      this.entityService
        .delete(entity.id)
        .pipe(takeUntil(this.unsubscriber$))
        .subscribe(
          (res) => {
            this.messages.deletedToast(entity.name);
            this.entities.splice(index, 1);
            this.isLoading = false;
            this.isError = false;
          },
          (err) => {
            this.messages.toast('خطأ ما في الشبكة', 'error');
            this.isLoading = false;
          }
        );
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
}
