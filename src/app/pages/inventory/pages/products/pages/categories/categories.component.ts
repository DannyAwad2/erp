import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { takeUntil } from 'rxjs';
import { CategoryModalComponent } from 'src/app/core/components/categories/create-category-modal/create-category-modal.component';
import { UpdateCategoryModalComponent } from 'src/app/core/components/categories/update-category-modal/update-category-modal.component';
import { ICategory } from 'src/app/core/models/icategory';
import { CategoriesService } from 'src/app/core/services/categories.service';
import { MessagesService } from 'src/app/core/services/messages.service';
import { Unsubscriber } from 'src/app/core/utils/unsubscriber';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
  imports: [
    CategoryModalComponent,
    UpdateCategoryModalComponent,
    CommonModule,
    NgbDropdownModule,
    FormsModule,
  ],
})
export class CategoriesComponent extends Unsubscriber implements OnInit {
  @ViewChild(CategoryModalComponent)
  CategoryModalRef!: CategoryModalComponent;
  categories: ICategory[] = [];
  fliterdCategories: ICategory[] = [];
  isError = false;
  isLoading = false;

  messages = inject(MessagesService);
  categoryService = inject(CategoriesService);

  ngOnInit() {
    this.fetchCategories();

    this.categoryService.onCreated
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe((category) => {
        this.categories.unshift(category);
        this.fliterdCategories = this.categories;
      });

    this.categoryService.onEdited
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe((category) => {
        const index = this.fliterdCategories.findIndex(
          (c) => c.id === category.id
        );
        this.categories.splice(index, 1, category);
        this.fliterdCategories = this.categories;
      });
  }

  fetchCategories() {
    this.isError = false;
    this.isLoading = true;
    this.categoryService
      .getAll()
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe({
        next: (cats) => {
          this.categories = cats;
          this.fliterdCategories = cats;
          this.isError = false;
          this.isLoading = false;
        },
        error: () => {
          this.isError = true;
          this.isLoading = true;
        },
      });
  }

  createCategory() {
    this.CategoryModalRef.open(null);
  }

  onEdit(category: ICategory) {
    this.categoryService.onSelected.next(category);
  }

  async onDelete(category: ICategory, index: number) {
    const { isConfirmed } = await this.messages.deleteConfirm(category.name);
    if (isConfirmed) {
      this.isLoading = true;
      this.categoryService
        .delete(category.id)
        .pipe(takeUntil(this.unsubscriber$))
        .subscribe(
          (res) => {
            this.categories.splice(index, 1);
            this.isLoading = false;
            this.isError = false;
          },
          (err) => {
            this.isLoading = false;
          }
        );
    }
  }

  onFilter(term: any) {
    if (term.target.value.trim() === '') {
      this.fliterdCategories = this.categories;
      return;
    }
    this.fliterdCategories = this.categories.filter((category) =>
      category.name.toLowerCase().includes(term.target.value.toLowerCase())
    );
  }
}
