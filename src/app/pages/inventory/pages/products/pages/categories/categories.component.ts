import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { takeUntil } from 'rxjs';
import { CreateCategoryModalComponent } from 'src/app/core/components/categories/create-category-modal/create-category-modal.component';
import { UpdateCategoryModalComponent } from 'src/app/core/components/categories/update-category-modal/update-category-modal.component';
import { ICategory } from 'src/app/core/models/icategory';
import { CategoriesService } from 'src/app/core/services/categories.service';
import { MessagesService } from 'src/app/core/services/messages.service';
import { Unsubscriber } from 'src/app/core/utils/unsubscriber';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
  standalone: true,
  imports: [
    CreateCategoryModalComponent,
    UpdateCategoryModalComponent,
    CommonModule,
    NgbDropdownModule,
    FormsModule,
  ],
})
export class CategoriesComponent extends Unsubscriber implements OnInit {
  @ViewChild(CreateCategoryModalComponent)
  createEntityModalRef!: CreateCategoryModalComponent;
  entities: ICategory[] = [];
  fliterdEntites: ICategory[] = [];
  isError = false;
  isLoading = false;

  constructor(
    private entityService: CategoriesService,
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

  onEdit(entity: ICategory) {
    this.entityService.onSelected.next(entity);
  }

  async onDelete(entity: ICategory, index: number) {
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
