import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import {
  NgbDatepickerModule,
  NgbModalRef,
  NgbModal,
} from '@ng-bootstrap/ng-bootstrap';
import { takeUntil } from 'rxjs';
import { ICreateCategory } from 'src/app/core/models/form-models/icreate-category';
import { ICategory } from 'src/app/core/models/icategory';
import { CategoriesService } from 'src/app/core/services/categories.service';
import { MessagesService } from 'src/app/core/services/messages.service';
import { Unsubscriber } from 'src/app/core/utils/unsubscriber';

@Component({
  selector: 'app-update-category-modal',
  templateUrl: './update-category-modal.component.html',
  styleUrls: ['./update-category-modal.component.scss'],
  standalone: true,
  imports: [NgbDatepickerModule, ReactiveFormsModule, CommonModule],
})
export class UpdateCategoryModalComponent
  extends Unsubscriber
  implements OnInit
{
  @ViewChild('content') modalContent: any;
  form!: FormGroup<ICreateCategory>;
  activeModalRef!: NgbModalRef;
  isSubmiting = false;
  id: number = 0;

  constructor(
    private modalService: NgbModal,
    private categoriesService: CategoriesService,
    private messages: MessagesService
  ) {
    super();
  }

  ngOnInit() {
    this.form = new FormGroup<ICreateCategory>({
      name: new FormControl(null, Validators.required),
    });

    this.categoriesService.categorySelectedEvent
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe((category) => {
        (this.id = category.id),
          this.form.patchValue({
            name: category.name,
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

    const updatedCategory: ICategory = {
      id: this.id,
      name: this.formControls.name.value || '',
    };

    this.categoriesService
      .updateCategory(updatedCategory)
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe(
        (category) => {
          this.close();
          this.categoriesService.categoryEditedEvent.emit(category);
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
