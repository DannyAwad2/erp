import { Component, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  NgbDatepickerModule,
  NgbModal,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';

import { Unsubscriber } from '../../../utils/unsubscriber';
import { ICategoryForm } from 'src/app/core/models/form-models/icreate-category';
import { CategoriesService } from 'src/app/core/services/categories.service';
import { takeUntil } from 'rxjs';
import { MessagesService } from 'src/app/core/services/messages.service';
import { ICategory } from 'src/app/core/models/icategory';

@Component({
  selector: 'app-create-category-modal',
  templateUrl: './create-category-modal.component.html',
  styleUrls: ['./create-category-modal.component.scss'],
  imports: [NgbDatepickerModule, ReactiveFormsModule, CommonModule],
})
export class CategoryModalComponent extends Unsubscriber implements OnInit {
  @ViewChild('content') modalContent: any;
  form!: FormGroup<ICategoryForm>;
  activeModalRef!: NgbModalRef;
  isSubmiting = false;
  category: ICategory | null = null;

  constructor(
    private modalService: NgbModal,
    private categoryService: CategoriesService
  ) {
    super();
  }

  ngOnInit() {
    this.form = new FormGroup<ICategoryForm>({
      name: new FormControl(null, Validators.required),
    });
  }

  open(category: ICategory | null) {
    this.category = category;
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

    const categoryName = this.form.value.name || '';

    if (this.category) {
      this.categoryService
        .update({ ...this.category, name: categoryName })
        .pipe(takeUntil(this.unsubscriber$))
        .subscribe({
          next: () => {
            this.close();
          },
          error: () => {
            this.form.enable();
            this.isSubmiting = false;
          },
        });
    } else {
      this.categoryService
        .create(categoryName)
        .pipe(takeUntil(this.unsubscriber$))
        .subscribe({
          next: () => {
            this.close();
          },
          error: () => {
            this.form.enable();
            this.isSubmiting = false;
          },
        });
    }
  }

  get formControls() {
    return this.form.controls;
  }
}
