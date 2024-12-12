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
import { ICreateCategory } from 'src/app/core/models/form-models/icreate-category';
import { CategoriesService } from 'src/app/core/services/categories.service';
import { takeUntil } from 'rxjs';
import { MessagesService } from 'src/app/core/services/messages.service';

@Component({
    selector: 'app-create-category-modal',
    templateUrl: './create-category-modal.component.html',
    styleUrls: ['./create-category-modal.component.scss'],
    imports: [NgbDatepickerModule, ReactiveFormsModule, CommonModule]
})
export class CreateCategoryModalComponent
  extends Unsubscriber
  implements OnInit
{
  @ViewChild('content') modalContent: any;
  form!: FormGroup<ICreateCategory>;
  activeModalRef!: NgbModalRef;
  isSubmiting = false;

  constructor(
    private modalService: NgbModal,
    private entitiesService: CategoriesService,
    private messages: MessagesService
  ) {
    super();
  }

  ngOnInit() {
    this.form = new FormGroup<ICreateCategory>({
      name: new FormControl(null, Validators.required),
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

    const entityName = this.form.value.name || '';

    this.entitiesService
      .create(entityName)
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe(
        () => {
          this.close();
        },
        () => {
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
