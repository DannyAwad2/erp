import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { SpinnerComponent } from '../spinner/spinner.component';
import { IClient } from '../../models/iclient';
import { ClientsService } from '../../services/clients.service';
import { ITransaction } from '../../models/itransaction';

@Component({
  selector: 'app-client-info-card',
  templateUrl: './client-info-card.component.html',
  styleUrls: ['./client-info-card.component.scss'],
  imports: [CommonModule, SpinnerComponent],
})
export class ClientInfoCardComponent implements OnChanges {
  @Input('client') client: IClient | null = null;
  @Input('isLoading') isLoading: boolean = false;
  @Output('edit') edit = new EventEmitter<void>();
  openEditModal() {
    this.edit.emit();
  }

  constructor(private clientsService: ClientsService) {}

  ngOnChanges(): void {
    if (this.client) {
      this.isLoading = true;
      this.clientsService
        .getAllTrans(this.client?.id || 0)
        .subscribe((trans) => {
          this.isLoading = false;
          this.rowData = trans;
        });
    }
  }

  rowData: ITransaction[] | null = null;

  public overlayLoadingTemplate =
    '<span class="ag-overlay-loading-center">جاري تحميل البيانات</span>';
  public overlayNoRowsTemplate =
    '<span class="ag-overlay-loading-center">لم يتم اختيار اي عميل</span>';
}
