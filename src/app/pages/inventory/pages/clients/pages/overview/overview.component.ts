import { ClientsService } from 'src/app/core/services/clients.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClientFormModalComponent } from '../../components/client-form-modal/client-form-modal.component';
import { IClientAccountSummary } from 'src/app/core/models/iclient-account-summary';
import { SpinnerComponent } from 'src/app/core/components/spinner/spinner.component';
import { Unsubscriber } from 'src/app/core/utils/unsubscriber';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IClientFliterForm } from 'src/app/core/models/form-models/Iclient-filter-form';
import { IClient } from 'src/app/core/models/iclient';
import { MessagesService } from 'src/app/core/services/messages.service';
import { ClientInfoCardComponent } from 'src/app/core/components/client-info-card/client-info-card.component';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    NgbDropdownModule,
    ClientFormModalComponent,
    SpinnerComponent,
    ReactiveFormsModule,
    ClientInfoCardComponent,
  ],
})
export class OverviewComponent extends Unsubscriber implements OnInit {
  accountsSummary!: IClientAccountSummary[];
  filterdAccountsSummary!: IClientAccountSummary[];
  isDataLoaded = false;
  searchText = '';
  filterForm!: FormGroup<IClientFliterForm>;
  selectedClient: IClient | null = null;
  isLoading: boolean = false;

  constructor(
    private modalService: NgbModal,
    private clientsService: ClientsService,
    private messages: MessagesService
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
        if (value.type !== 'all') {
          if (account.balance > 0) {
            if (!value.name) {
              return true;
            }
            return account.name
              .toLowerCase()
              .includes(value.name.toLocaleLowerCase())
              ? true
              : false;
          }
        } else {
          if (!value.name) {
            return true;
          }
          if (
            account.name.toLowerCase().includes(value.name.toLocaleLowerCase())
          ) {
            return true;
          } else {
            return false;
          }
        }
        return false;
      });
    });
  }

  openCreateModal() {
    this.modalService.open(ClientFormModalComponent, { centered: true });
  }

  openEditModal() {
    if (this.selectedClient) {
      const modalRef = this.modalService.open(ClientFormModalComponent, {
        centered: true,
      });
      modalRef.componentInstance.client = this.selectedClient;
      modalRef.result.then((res) => {
        console.log(modalRef.componentInstance.client);
        console.log(res);
      });
    }
  }

  onSelect(id: number) {
    this.selectedClient = null;
    this.isLoading = true;
    this.clientsService.get(id).subscribe(
      (client) => {
        this.selectedClient = client;
        this.isLoading = false;
      },
      (err) => {
        this.messages.fechingDataError();
        this.isLoading = false;
      }
    );
  }
}
