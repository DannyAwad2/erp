import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IProduct } from '../models/iproduct';
import { ApiRoutes } from '../routes/api-routes';
import { MessagesService } from './messages.service';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  productCreatedEvent = new EventEmitter<IProduct>();
  productEditEvent = new EventEmitter<IProduct>();
  productDeleteEvent = new EventEmitter<IProduct>();

  private baseURL = environment.baseURL;

  constructor(
    private httpClient: HttpClient,
    private messages: MessagesService
  ) {}

  getProductsList(): Observable<IProduct[]> {
    return this.httpClient.get<IProduct[]>(
      `${this.baseURL + ApiRoutes.products}`
    );
  }

  createProduct(product: IProduct): Observable<IProduct> {
    return this.httpClient
      .post<IProduct>(`${this.baseURL + ApiRoutes.products}`, product)
      .pipe(
        tap((p) => {
          this.messages.createdToast(product.name);
          this.productCreatedEvent.emit(p);
        })
      );
  }

  getProductById(id: number): Observable<IProduct> {
    return this.httpClient.get<IProduct>(
      `${this.baseURL + ApiRoutes.products}/${id}`
    );
  }

  updateProduct(product: IProduct): Observable<Object> {
    return this.httpClient.put(
      `${this.baseURL + ApiRoutes.products}/${product.id}`,
      product
    );
  }

  deleteProduct(id: number): Observable<Object> {
    return this.httpClient.delete(`${this.baseURL + ApiRoutes.products}/${id}`);
  }
}
