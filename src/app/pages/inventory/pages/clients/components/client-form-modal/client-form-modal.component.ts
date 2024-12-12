import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { takeUntil } from 'rxjs';
import { IClientForm } from 'src/app/core/models/form-models/Iclient-form';
import { IClient } from 'src/app/core/models/iclient';
import { ClientsService } from 'src/app/core/services/clients.service';
import { MessagesService } from 'src/app/core/services/messages.service';
import { Unsubscriber } from 'src/app/core/utils/unsubscriber';

@Component({
  selector: 'app-client-form-modal',
  templateUrl: './client-form-modal.component.html',
  styleUrls: ['./client-form-modal.component.scss'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class ClientFormModalComponent extends Unsubscriber implements OnInit {
  @Input() client!: IClient;
  form!: FormGroup<IClientForm>;
  isEdit: boolean = false;
  isSubmiting = false;

  constructor(
    public activeModal: NgbActiveModal,
    private entitiesService: ClientsService,
    private messages: MessagesService
  ) {
    super();
  }

  ngOnInit(): void {
    this.form = new FormGroup<IClientForm>({
      name: new FormControl(null, Validators.required),
      address: new FormControl(null),
      phone: new FormControl(null),
      email: new FormControl(null),
      notes: new FormControl(null),
      website: new FormControl(null),
    });
    if (this.client) {
      this.form.patchValue({
        name: this.client.name,
        address: this.client.address,
        phone: this.client.phone,
        email: this.client.email,
        notes: this.client.notes,
        website: this.client.website,
      });
      this.isEdit = true;
    }
  }

  onClose() {
    this.form.reset();
    this.form.enable();
    this.activeModal.close();
    this.isSubmiting = false;
    this.unsubscriber$.next();
    this.unsubscriber$.complete();
    this.isEdit = false;
  }

  onSubmit() {
    if (this.formControls.name.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.form.disable();
    this.isSubmiting = true;

    const freshEntity: IClient = {
      id: 0,
      name: this.formControls.name.value || '',
      address: this.formControls.address.value || '',
      phone: this.formControls.phone.value || '',
      email: this.formControls.email.value || '',
      notes: this.formControls.notes.value || '',
      website: this.formControls.website.value || '',
    };

    if (this.client) {
      this.entitiesService
        .update(freshEntity)
        .pipe(takeUntil(this.unsubscriber$))
        .subscribe(
          () => {
            this.messages.toast('!تم الحفظ بنجاح', 'success');
            this.onClose();
          },
          () => {
            this.form.enable();
            this.isSubmiting = false;
            this.messages.toast('خطأ في الشبكة', 'error');
          }
        );
    } else {
      this.entitiesService
        .create(freshEntity)
        .pipe(takeUntil(this.unsubscriber$))
        .subscribe(
          () => {
            this.messages.createdToast(this.formControls.name.value || '');
            this.onClose();
          },
          () => {
            this.form.enable();
            this.isSubmiting = false;
            this.messages.toast('خطأ في الشبكة', 'error');
          }
        );
    }
  }

  get formControls() {
    return this.form.controls;
  }
}
