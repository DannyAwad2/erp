import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IProduct } from '../models/iproduct';
import { ApiRoutes } from '../routes/api-routes';
import { MessagesService } from './messages.service';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  onCreated = new Subject<IProduct>();
  onSelected = new Subject<IProduct>();
  onEdited = new Subject<IProduct>();

  private baseURL = environment.baseURL;

  constructor(
    private httpClient: HttpClient,
    private messages: MessagesService
  ) {}

  getAll(): Observable<IProduct[]> {
    return this.httpClient.get<IProduct[]>(
      `${this.baseURL + ApiRoutes.products}`
    );
  }

  create(product: IProduct): Observable<IProduct> {
    return this.httpClient
      .post<IProduct>(`${this.baseURL + ApiRoutes.products}`, product)
      .pipe(
        tap((p) => {
          this.messages.createdToast(product.name);
          this.onCreated.next(p);
        })
      );
  }

  getById(id: number): Observable<IProduct> {
    return this.httpClient.get<IProduct>(
      `${this.baseURL + ApiRoutes.products}/${id}`
    );
  }

  update(product: IProduct): Observable<IProduct> {
    return this.httpClient.put<IProduct>(
      `${this.baseURL + ApiRoutes.products}/${product.id}`,
      product
    );
  }

  delete(id: number): Observable<Object> {
    return this.httpClient.delete(`${this.baseURL + ApiRoutes.products}/${id}`);
  }
}
