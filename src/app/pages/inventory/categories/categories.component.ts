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
  createModalRef!: CreateCategoryModalComponent;
  categoies: ICategory[] = [];
  fliterdCategories: ICategory[] = [];
  isError = false;
  isLoading = false;

  constructor(
    private categoiesService: CategoriesService,
    private messages: MessagesService
  ) {
    super();
  }

  ngOnInit() {
    this.fetchCategories();

    this.categoiesService.categoryCreatedEvent
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe((category) => {
        this.categoies.unshift(category);
        this.fliterdCategories = this.categoies;
      });

    this.categoiesService.categoryEditedEvent
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe((category) => {
        const index = this.fliterdCategories.findIndex(
          (p) => p.id === category.id
        );
        this.fliterdCategories.splice(index, 1, category);
        this.fliterdCategories = this.categoies;
        this.messages.toast('تم التعديل بنجاح', 'success');
      });
  }

  fetchCategories() {
    this.isError = false;
    this.isLoading = true;
    this.categoiesService
      .getCategoryList()
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe(
        (categoies) => {
          this.categoies = categoies;
          this.fliterdCategories = categoies;
          this.isError = false;
          this.isLoading = false;
        },
        () => {
          this.isError = true;
          this.isLoading = true;
        }
      );
  }

  createCategory() {
    this.createModalRef.open();
  }

  onEdit(category: ICategory) {
    this.categoiesService.categorySelectedEvent.emit(category);
  }

  async onDelete(category: ICategory, index: number) {
    const { isConfirmed } = await this.messages.deleteConfirm(category.name);
    if (isConfirmed) {
      this.isLoading = true;
      this.categoiesService
        .deleteCategory(category.id)
        .pipe(takeUntil(this.unsubscriber$))
        .subscribe(
          (res) => {
            this.messages.deletedToast(category.name);
            this.categoies.splice(index, 1);
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
      this.fliterdCategories = this.categoies;
      return;
    }
    this.fliterdCategories = this.categoies.filter((category) =>
      category.name.includes(term.target.value)
    );
  }
}
