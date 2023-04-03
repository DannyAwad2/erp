import { Injectable } from '@angular/core';
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

  createProduct(product: IProduct): Observable<Object> {
    return this.httpClient
      .post(`${this.baseURL + ApiRoutes.products}`, product)
      .pipe(
        tap(() => {
          this.messages.createdToast(product.name);
        })
      );
  }

  getProductById(id: number): Observable<IProduct> {
    return this.httpClient.get<IProduct>(
      `${this.baseURL + ApiRoutes.products}/${id}`
    );
  }

  updateProduct(id: number, Product: IProduct): Observable<Object> {
    return this.httpClient.put(
      `${this.baseURL + ApiRoutes.products}/${id}`,
      Product
    );
  }

  deleteProduct(id: number): Observable<Object> {
    return this.httpClient.delete(`${this.baseURL + ApiRoutes.products}/${id}`);
  }
}
