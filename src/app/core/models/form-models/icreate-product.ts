import { FormControl } from '@angular/forms';

export interface ICreateProduct {
  name: FormControl<string | null>;
  price: FormControl<number | null>;
  stock: FormControl<number | null>;
  cost: FormControl<number | null>;
  category: FormControl<string | null>;
}
