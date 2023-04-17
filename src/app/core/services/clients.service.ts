import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IClient } from '../models/iclient';
import { ApiRoutes } from '../routes/api-routes';
import { IClientAccountSummary } from '../models/iclient-account-summary';
import { ITransaction } from '../models/itransaction';
import { delay, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClientsService {
  readonly baseUrl = environment.baseURL + ApiRoutes.clients;
  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<IClient[]>(this.baseUrl);
  }

  getAccountsSummary() {
    return this.http.get<IClientAccountSummary[]>(
      environment.baseURL + '/clients_summary'
    );
  }

  get(id: number) {
    return this.http.get<IClient>(this.baseUrl + '/' + id);
  }

  create(client: IClient) {
    return this.http.post<IClient>(this.baseUrl, client);
  }

  update(client: IClient) {
    return this.http.put<IClient>(this.baseUrl + '/' + client.id, client);
  }

  delete(id: number) {
    return this.http.delete<IClient>(this.baseUrl + '/' + id);
  }

  getAllTrans(clientId: number) {
    const rowData: ITransaction[] = [
      {
        type: 'Toyota',
        id: 'Celica',
        date: new Date().toLocaleString(),
        account: 'Celica',
      },
      {
        type: 'Toyota',
        id: 'Celica',
        date: new Date().toLocaleString(),
        account: 'Celica',
      },
      {
        type: 'Toyota',
        id: 'Celica',
        date: new Date().toLocaleString(),
        account: 'Celica',
      },
      {
        type: 'Toyota',
        id: 'Celica',
        date: new Date().toLocaleString(),
        account: 'Celica',
      },
    ];
    return of(rowData).pipe(delay(2000));
    return this.http.get<ITransaction[]>(
      this.baseUrl + '/transactions/' + clientId
    );
  }
}
