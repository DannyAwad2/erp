import { FormControl } from '@angular/forms';

export interface IClientForm {
  name: FormControl<string | null>;
  address: FormControl<string | null>;
  phone: FormControl<string | null>;
  email: FormControl<string | null>;
  notes: FormControl<string | null>;
  website: FormControl<string | null>;
}
