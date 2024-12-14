import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, Observable, Subject, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiRoutes } from '../routes/api-routes';
import { MessagesService } from './messages.service';
import { ICategory } from '../models/icategory';
import {
  collection,
  collectionData,
  CollectionReference,
  DocumentData,
  Firestore,
  getDocs,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  onCreated = new Subject<ICategory>();
  onSelected = new Subject<ICategory>();
  onEdited = new Subject<ICategory>();

  private baseURL = environment.baseURL;
  private httpClient = inject(HttpClient);
  private messages = inject(MessagesService);
  private firestore = inject(Firestore);

  private catCollRef: CollectionReference<DocumentData, DocumentData>;

  constructor() {
    this.catCollRef = collection(this.firestore, 'categories');
  }

  getAll(): Observable<ICategory[]> {
    const p = collectionData(this.catCollRef, { idField: 'id' });
    return p as Observable<ICategory[]>;
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
