import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, delay, Observable, Subject, tap, throwError } from 'rxjs';
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
  onDeleted = new Subject<ICategory>();

  private baseURL = environment.baseURL;
  private http = inject(HttpClient);
  private messages = inject(MessagesService);

  constructor() {}

  getAll(): Observable<ICategory[]> {
    return this.http.get<ICategory[]>(this.baseURL + ApiRoutes.categories);
  }

  create(name: string): Observable<ICategory> {
    return this.http
      .post<ICategory>(`${this.baseURL}${ApiRoutes.categories}`, { name })
      .pipe(
        tap((p) => {
          this.onCreated.next(p);
        }),
        catchError(() => {
          this.messages.createErrorPopup(name);
          return throwError(
            () => new Error('error while creating new category')
          );
        })
      );
  }

  getById(id: number): Observable<ICategory> {
    return this.http.get<ICategory>(
      `${this.baseURL}${ApiRoutes.categories}/${id}`
    );
  }

  update(category: ICategory): Observable<ICategory> {
    return this.http
      .put<ICategory>(`${this.baseURL}${ApiRoutes.categories}/${category.id}`, {
        name: category.name,
      })
      .pipe(
        tap((p) => {
          this.onEdited.next(p);
        })
      );
  }

  delete(id: number): Observable<ICategory> {
    return this.http
      .delete<ICategory>(`${this.baseURL}${ApiRoutes.categories}/${id}`)
      .pipe(
        tap((cat) => {
          this.onDeleted.next(cat);
        })
      );
  }
}
