import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  NgbDropdownModule,
  NgbModal,
  NgbNavModule,
} from '@ng-bootstrap/ng-bootstrap';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import { ClientFormModalComponent } from './components/client-form-modal/client-form-modal.component';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    NgbDropdownModule,
    NgbNavModule,
    AgGridModule,
    ClientFormModalComponent,
  ],
})
export class ClientsComponent {
  constructor(private modalService: NgbModal) {}

  openModal() {
    const modalRef = this.modalService.open(ClientFormModalComponent);
    modalRef.componentInstance.name = 'World';
  }

  public defaultColDef: ColDef = {
    sortable: true,
    flex: 1,
  };

  columnDefs: ColDef[] = [
    { field: 'type', headerName: 'نوع العملية' },
    { field: 'id', headerName: 'رقم العملية' },
    { field: 'date', headerName: 'تاريخ العملية' },
    { field: 'account', headerName: 'الحساب' },
  ];

  rowData = [
    { type: 'Toyota', id: 'Celica', date: 35000, account: 'Celica' },
    { type: 'Toyota', id: 'Celica', date: 35000, account: 'Celica' },
    { type: 'Toyota', id: 'Celica', date: 35000, account: 'Celica' },
    { type: 'Toyota', id: 'Celica', date: 35000, account: 'Celica' },
  ];
}
