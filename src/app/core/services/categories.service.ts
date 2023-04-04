import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiRoutes } from '../routes/api-routes';
import { MessagesService } from './messages.service';
import { ICategory } from '../models/icategory';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  categoryCreatedEvent = new EventEmitter<ICategory>();
  categorySelectedEvent = new EventEmitter<ICategory>();
  categoryEditedEvent = new EventEmitter<ICategory>();

  private baseURL = environment.baseURL;

  constructor(
    private httpClient: HttpClient,
    private messages: MessagesService
  ) {}

  getCategoryList(): Observable<ICategory[]> {
    return this.httpClient.get<ICategory[]>(
      `${this.baseURL + ApiRoutes.categories}`
    );
  }

  createCategory(name: string): Observable<ICategory> {
    return this.httpClient
      .post<ICategory>(`${this.baseURL + ApiRoutes.categories}`, { name })
      .pipe(
        tap((p) => {
          this.messages.createdToast(name);
          this.categoryCreatedEvent.emit(p);
        })
      );
  }

  getCategoryById(id: number): Observable<ICategory> {
    return this.httpClient.get<ICategory>(
      `${this.baseURL + ApiRoutes.categories}/${id}`
    );
  }

  updateCategory(category: ICategory): Observable<ICategory> {
    return this.httpClient.put<ICategory>(
      `${this.baseURL + ApiRoutes.categories}/${category.id}`,
      { name: category.name }
    );
  }

  deleteCategory(id: number): Observable<Object> {
    return this.httpClient.delete(
      `${this.baseURL + ApiRoutes.categories}/${id}`
    );
  }
}
