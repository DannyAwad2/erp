import { Component } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ITransaction } from 'src/app/core/models/itransaction';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  imports: [NgbDropdownModule],
})
export class OverviewComponent {
  rowData: ITransaction[] | null = null;

  public overlayLoadingTemplate =
    '<span class="ag-overlay-loading-center">جاري تحميل البيانات</span>';
  public overlayNoRowsTemplate =
    '<span class="ag-overlay-loading-center">لا توجد اي معاملات حتي الان</span>';
}
