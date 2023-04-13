import { IProduct } from './iproduct';
import { ITransType } from './itrans-type';

export interface IPruchaseCart {
  id: number;
  products: IProduct[];
  totalStock: number;
  totalCost: number;
  transType: string;
}
