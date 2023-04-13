import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IClient } from '../models/iclient';
import { ApiRoutes } from '../routes/api-routes';

@Injectable({
  providedIn: 'root',
})
export class ClientsService {
  readonly baseUrl = environment.baseURL + ApiRoutes.clients;
  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<IClient[]>(this.baseUrl);
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
}
