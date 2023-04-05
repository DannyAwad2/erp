import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiRoutes } from '../routes/api-routes';
import { MessagesService } from './messages.service';
import { ICategory } from '../models/icategory';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  onCreated = new Subject<ICategory>();
  onSelected = new Subject<ICategory>();
  onEdited = new Subject<ICategory>();

  private baseURL = environment.baseURL;

  constructor(
    private httpClient: HttpClient,
    private messages: MessagesService
  ) {}

  getAll(): Observable<ICategory[]> {
    return this.httpClient.get<ICategory[]>(
      `${this.baseURL + ApiRoutes.categories}`
    );
  }

  create(name: string): Observable<ICategory> {
    return this.httpClient
      .post<ICategory>(`${this.baseURL + ApiRoutes.categories}`, { name })
      .pipe(
        tap((p) => {
          this.messages.createdToast(name);
          this.onCreated.next(p);
        })
      );
  }

  getById(id: number): Observable<ICategory> {
    return this.httpClient.get<ICategory>(
      `${this.baseURL + ApiRoutes.categories}/${id}`
    );
  }

  update(category: ICategory): Observable<ICategory> {
    return this.httpClient.put<ICategory>(
      `${this.baseURL + ApiRoutes.categories}/${category.id}`,
      { name: category.name }
    );
  }

  delete(id: number): Observable<Object> {
    return this.httpClient.delete(
      `${this.baseURL + ApiRoutes.categories}/${id}`
    );
  }
}
