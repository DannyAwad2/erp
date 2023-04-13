import { ClientsService } from 'src/app/core/services/clients.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  NgbDropdownModule,
  NgbNavModule,
  NgbModal,
} from '@ng-bootstrap/ng-bootstrap';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import { ClientFormModalComponent } from '../../components/client-form-modal/client-form-modal.component';
import { IClientAccountSummary } from 'src/app/core/models/iclient-account-summary';
import { Observable } from 'rxjs';
import { SpinnerComponent } from 'src/app/core/components/spinner/spinner.component';
import { Unsubscriber } from 'src/app/core/utils/unsubscriber';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { IClientFliterForm } from 'src/app/core/models/form-models/Iclient-filter-form';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    NgbDropdownModule,
    NgbNavModule,
    AgGridModule,
    ClientFormModalComponent,
    SpinnerComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class OverviewComponent extends Unsubscriber implements OnInit {
  accountsSummary!: IClientAccountSummary[];
  filterdAccountsSummary!: IClientAccountSummary[];
  isDataLoaded = false;
  searchText = '';
  filterForm!: FormGroup<IClientFliterForm>;

  constructor(
    private modalService: NgbModal,
    private clientsService: ClientsService
  ) {
    super();
  }

  ngOnInit(): void {
    this.clientsService.getAccountsSummary().subscribe((data) => {
      this.accountsSummary = data;
      this.filterdAccountsSummary = data;
      this.isDataLoaded = true;
    });

    this.filterForm = new FormGroup<IClientFliterForm>({
      name: new FormControl<string | null>(null),
      type: new FormControl<string | null>('all'),
    });

    this.filterForm.valueChanges.subscribe((value) => {
      if (value.name === null && value.type === 'all') {
        this.filterdAccountsSummary = this.accountsSummary;
        return;
      }

      this.filterdAccountsSummary = this.accountsSummary.filter((account) => {
        if (
          value.name &&
          !account.name.toLowerCase().includes(value.name.toLocaleLowerCase())
        ) {
          return false;
        }
        if (value.type !== 'all' && account.balance === 0) {
          return false;
        }
        return true;
      });
    });
  }

  onSearchTextChange(event: any) {
    const text = event.target.value.trim().toLowerCase();
    if (text === '') {
      this.filterdAccountsSummary = this.accountsSummary;
      return;
    }
    this.filterdAccountsSummary = this.accountsSummary.filter((account) => {
      return account.name.toLowerCase().includes(text);
    });
  }

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
