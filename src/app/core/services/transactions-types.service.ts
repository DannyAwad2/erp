import { Injectable } from '@angular/core';
import { ITransType } from '../models/itrans-type';

@Injectable({
  providedIn: 'root',
})
export class TransactionsTypesService {
  transactionsTypes: ITransType[] = [];
  constructor() {}
}
