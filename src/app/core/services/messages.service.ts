import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import Swal, { SweetAlertIcon, SweetAlertResult } from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  constructor(private router: Router) {}
  confirm(
    btnTitle: string = 'Sure!',
    message: string = 'Message',
    btn: string = 'primary',
    icon: SweetAlertIcon = 'question'
  ): Promise<SweetAlertResult<any>> {
    return Swal.fire({
      title: 'هل انت متأكد؟',
      text: `هل تريد ${message}`,
      icon: icon,
      showCancelButton: true,
      cancelButtonText: 'ألغاء',
      customClass: {
        confirmButton: `btn btn-${btn} btn-sm w-xs me-2 mt-2`,
        cancelButton: 'btn btn-ghost-danger btn-sm w-xs mt-2',
      },
      confirmButtonText: `نعم, ${btnTitle}`,
      buttonsStyling: false,
      showCloseButton: true,
    });
  }

  popup(title: string, message: string, icon: SweetAlertIcon = 'info') {
    return Swal.fire({
      title: title,
      text: message,
      icon: icon,
      background: 'var(--vz-modal-bg)',
    });
  }

  async success(type: string = 'User') {
    const res = await Swal.fire({
      title: 'Success',
      text: `${type} created successfully`,
      icon: 'success',
      background: 'var(--vz-modal-bg)',
    });
    const res2 = await Swal.fire({
      icon: 'question',
      title: 'Do you want to create a new client?',
      showDenyButton: true,
      confirmButtonText: 'Create',
    });
    if (res2.isDenied) {
      this.router.navigate(['Clients']);
    } else {
      document.body.scrollTop = 0;
    }
  }

  toast(message: string, icon: SweetAlertIcon = 'info') {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-right',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });

    return Toast.fire({
      icon: icon,
      title: message,
    });
  }

  createdToast(name: string) {
    this.toast(`تم إضافة (${name}) بنجاح`, 'success');
  }

  createErrorPopup(name: string) {
    this.popup(
      'Error',
      `Error while adding (${name}), please try again.`,
      'error'
    );
  }

  updatedConfirm(oldName: string, newName: string) {
    return this.confirm('Update', `(${oldName}) updated to (${newName})`);
  }
  updatedToast(oldName: string, newName: string) {
    this.toast(`(${oldName}) updated to (${newName})`, 'success');
  }
  updateErrorPopup(data: string) {
    this.popup(
      'Error',
      `Error while updating ${data}, please try again.`,
      'error'
    );
  }

  deleteConfirm(name: string) {
    return this.confirm('مسح', `مسح (${name})؟`);
  }
  deletedToast(name: string) {
    return this.toast(`تم مسح (${name}) بنجاح`, 'success');
  }
  deleteErrorPopup(name: string) {
    this.popup(
      'Error',
      `Error while deleting (${name}), please try again.`,
      'error'
    );
  }
  fechingDataError() {
    this.popup('Error', `Error while loading data, please try again.`, 'error');
  }
}
