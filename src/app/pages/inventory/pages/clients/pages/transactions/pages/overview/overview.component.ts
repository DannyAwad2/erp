import { Component } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import { ITransaction } from 'src/app/core/models/itransaction';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  standalone: true,
  imports: [AgGridModule, NgbDropdownModule],
})
export class OverviewComponent {
  defaultColDef: ColDef = {
    sortable: true,
    flex: 1,
  };

  columnDefs: ColDef[] = [
    { field: 'type', headerName: 'نوع العملية' },
    { field: 'id', headerName: 'رقم العملية' },
    { field: 'date', headerName: 'تاريخ العملية' },
    { field: 'account', headerName: 'الحساب' },
  ];

  rowData: ITransaction[] | null = null;

  public overlayLoadingTemplate =
    '<span class="ag-overlay-loading-center">جاري تحميل البيانات</span>';
  public overlayNoRowsTemplate =
    '<span class="ag-overlay-loading-center">لا توجد اي معاملات حتي الان</span>';
}
