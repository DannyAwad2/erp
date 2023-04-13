import { FormControl } from '@angular/forms';

export interface IClientFliterForm {
  name: FormControl<string | null>;
  type: FormControl<string | null>;
}
