import { inject, Injectable } from '@angular/core';
import {
  BehaviorSubject,
  concatMap,
  delay,
  from,
  Observable,
  of,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import { IProduct } from '../models/iproduct';
import { MessagesService } from './messages.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  onCreated = new Subject<IProduct>();
  onSelected = new Subject<IProduct>();
  onEdited = new Subject<IProduct>();
  onPageSizeChange = new BehaviorSubject<number>(10);

  private messages = inject(MessagesService);
  private http = inject(HttpClient);

  private baseUrl = environment.baseURL;

  constructor() {}

  getAll(): Observable<IProduct[]> {
    return this.onPageSizeChange
      .pipe(
        concatMap((page) =>
          this.http.get<IProduct[]>(this.baseUrl + '/products', {
            headers: new HttpHeaders({ _per_page: page }),
          })
        )
      )
      .pipe(delay(300));
  }

  getByCatName(name: string): Observable<IProduct[]> {
    if (!name) {
      return this.getAll();
    } else {
      return from([]) as Observable<IProduct[]>;
    }
  }

  create(product: {
    cost: number;
    price: number;
    category: string;
    name: string;
    published: string;
    stock: number;
  }) {
    return this.http.post<IProduct>(this.baseUrl + '/products', product);
  }

  update(product: IProduct): Observable<IProduct> {
    return this.http.put<IProduct>(
      this.baseUrl + '/products/' + product.id,
      product
    );
  }

  delete(id: string): Observable<IProduct> {
    return this.http.delete<IProduct>(this.baseUrl + '/products/' + id);
  }
}
