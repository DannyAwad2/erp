import { FormControl } from '@angular/forms';

export interface ICreateCategory {
  name: FormControl<string | null>;
}
