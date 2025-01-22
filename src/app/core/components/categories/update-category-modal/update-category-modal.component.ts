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
import { ICategoryForm } from 'src/app/core/models/form-models/icreate-category';
import { ICategory } from 'src/app/core/models/icategory';
import { CategoriesService } from 'src/app/core/services/categories.service';
import { MessagesService } from 'src/app/core/services/messages.service';
import { Unsubscriber } from 'src/app/core/utils/unsubscriber';

@Component({
  selector: 'app-update-category-modal',
  templateUrl: './update-category-modal.component.html',
  styleUrls: ['./update-category-modal.component.scss'],
  imports: [NgbDatepickerModule, ReactiveFormsModule, CommonModule],
})
export class UpdateCategoryModalComponent
  extends Unsubscriber
  implements OnInit
{
  @ViewChild('content') modalContent: any;
  form!: FormGroup<ICategoryForm>;
  activeModalRef!: NgbModalRef;
  isSubmiting = false;
  id: number = 0;

  constructor(
    private modalService: NgbModal,
    private entitiesService: CategoriesService,
    private messages: MessagesService
  ) {
    super();
  }

  ngOnInit() {
    this.form = new FormGroup<ICategoryForm>({
      name: new FormControl(null, Validators.required),
    });

    this.entitiesService.onSelected
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe((entity) => {
        (this.id = entity.id),
          this.form.patchValue({
            name: entity.name,
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

    const updatedEntity: ICategory = {
      id: this.id,
      name: this.formControls.name.value || '',
    };

    this.entitiesService
      .update(updatedEntity)
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe(
        (entity) => {
          this.close();
          this.entitiesService.onEdited.next(entity);
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
