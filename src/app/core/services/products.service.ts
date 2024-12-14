import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  catchError,
  from,
  map,
  Observable,
  Subject,
  tap,
  throwError,
} from 'rxjs';
import { environment } from 'src/environments/environment';
import { IProduct } from '../models/iproduct';
import { ApiRoutes } from '../routes/api-routes';
import { MessagesService } from './messages.service';
import {
  addDoc,
  collection,
  collectionData,
  CollectionReference,
  deleteDoc,
  doc,
  DocumentData,
  documentId,
  Firestore,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  onCreated = new Subject<IProduct>();
  onSelected = new Subject<IProduct>();
  onEdited = new Subject<IProduct>();

  private firestore = inject(Firestore);
  private messages = inject(MessagesService);

  productsCol!: CollectionReference<DocumentData, DocumentData>;

  constructor() {
    this.productsCol = collection(this.firestore, 'products');
  }

  getAll(): Observable<IProduct[]> {
    const products = collectionData(this.productsCol);
    return from(products) as Observable<IProduct[]>;
  }

  getByCatName(name: string): Observable<IProduct[]> {
    if (!name) {
      return this.getAll();
    } else {
      const q = query(this.productsCol, where('category', '==', name));
      const promise = collectionData(q);
      return from(promise) as Observable<IProduct[]>;
    }
  }

  create(product: IProduct): Observable<string> {
    const newProduct = addDoc(this.productsCol, product);
    const promise = newProduct.then((res) => res.id);
    return from(promise).pipe(
      catchError((error) => {
        this.messages.toast('خطأ في الشبكة', 'error');
        return throwError(() => error);
      })
    );
  }

  update(product: IProduct): Observable<void> {
    const docRef = doc(this.firestore, 'products/' + product.id);
    const p = updateDoc(docRef, { ...product });
    return from(p) as Observable<void>;
  }

  delete(id: string): Observable<void> {
    const docRef = doc(this.firestore, 'products/' + id);
    const p = deleteDoc(docRef);
    return from(p) as Observable<void>;
  }
}
